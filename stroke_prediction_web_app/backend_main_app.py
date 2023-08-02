from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS, cross_origin
from configparser import ConfigParser
import pickle
from sklearn.preprocessing import StandardScaler
from sklearn.compose import ColumnTransformer
import uuid
import random
import numpy as np
import json
from datetime import datetime, timedelta
import math

np.random.seed(random.randint(50,2000))

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

########################################################################################################################################
# GLOBALS
########################################################################################################################################

RISK_TRHESHOLD = 50
SPECIAL_COLUMNS = {
    'hypertension_0': ('no', 'hypertension'),
    'hypertension_1': ('yes', 'hypertension'),
    'heart_disease_0': ('no', 'heart_disease'),
    'heart_disease_1': ('yes', 'heart_disease'),
    'gender_Female': ('female', 'gender'),
    'gender_Male': ('male','gender'),
    'ever_married_No': ('no', 'ever_married'),
    'ever_married_Yes': ('yes', 'ever_married'),
    'work_type_Govt_job': ('government',  'work_type'),
    'work_type_Never_worked': ('never worked',  'work_type'),
    'work_type_Private': ('private',  'work_type'),
    'work_type_Self-employed': ('self employed',  'work_type'),
    'work_type_children': ('children',  'work_type'),
    'Residence_type_Rural': ('rural', 'residence_type'),
    'Residence_type_Urban': ('urban', 'residence_type'),
    'smoking_status_Unknown': ('unknown', 'smoking_status'),
    'smoking_status_formerly smoked': ('formerly smoked', 'smoking_status'),
    'smoking_status_never smoked': ('never smoked', 'smoking_status'),
    'smoking_status_smokes': ('smokes', 'smoking_status')
}

########################################################################################################################################
########################################################################################################################################

config = ConfigParser()
config.read('app_configurations.ini')

client = MongoClient(str(config.get('MongoDB', 'endpoint')))

stroke_pred_db = client[str(config.get('MongoDB', 'database_name'))]
patient_data_collection = stroke_pred_db[str(config.get('MongoDB', 'patient_collection_name'))]
provider_data_collection = stroke_pred_db[str(config.get('MongoDB', 'provider_collection_name'))]

########################################################################################################################################
########################################################################################################################################

with open('ml_model/test_set.pkl', 'rb') as f:
    X_test, y_test = pickle.load(f)

with open('ml_model/data_labels.pkl', 'rb') as f:
    X_labels, y_label = pickle.load(f)

with open('ml_model/column_transformer.pkl', 'rb') as f:
    column_transformer = pickle.load(f)

with open('ml_model/model.pkl', 'rb') as f:
    model = pickle.load(f)

with open('ml_model/population_level_data.json', 'r') as json_file:
    population_level_data = json.load(json_file)

########################################################################################################################################
########################################################################################################################################

def convert_into_mongoDB_dictionary(X_labels, X_subset):

    # Add the columns of X_subset as modified dictionaries
    patient_dictionaries = []
    for row in X_subset:
        row_dict = {}
        for i, value in enumerate(row):
            column_name = X_labels[i]
            if column_name in SPECIAL_COLUMNS.keys():
                if value == 1:
                    mapping, key = SPECIAL_COLUMNS[column_name]
                    row_dict[key] = mapping
            else:
                row_dict[column_name] = value
        patient_dictionaries.append(row_dict)

    return patient_dictionaries


def add_patient_names_ids_and_test_dates(patient_dictionaries):
    # Generate 50 random patient IDs
    #patient_ids = [str(uuid.uuid4()) for _ in range(50)]
    patient_ids = [''.join(random.choices('0123456789', k=8)) for _ in range(50)]

    # List of common given and last names
    female_first_names = ['Emma', 'Madison', 'Chloe', 'Grace', 'Sarah', 'Lily', 'Mia', 'Harper', 'Isabella', 'Sofia', 'Olivia', 'Ava', 'Emily', 'Elizabeth', 'Victoria', 'Charlotte', 'Amelia', 'Abigail', 'Natalie', 'Jasmine']
    female_last_names = ['Johnson', 'Davis', 'Smith', 'Rodriguez', 'Lee', 'Brown', 'Hernandez', 'Perez', 'Nguyen', 'Kim', 'Martinez', 'Taylor', 'Jones', 'Wilson', 'Garcia', 'Chen', 'Chen', 'Wong', 'Lim', 'Park']

    male_first_names = ['Ethan', 'William', 'Benjamin', 'James', 'Alexander', 'Noah', 'Liam', 'Lucas', 'Samuel', 'Daniel', 'Matthew', 'Michael', 'David', 'John', 'Andrew', 'Ryan', 'Christopher', 'Nicholas', 'Kevin', 'Justin']
    male_last_names = ['Lee', 'Kim', 'Garcia', 'Rodriguez', 'Nguyen', 'Davis', 'Chen', 'Wong', 'Park', 'Kim', 'Chen', 'Wong', 'Chang', 'Lee', 'Wu', 'Chao', 'Huang', 'Chen', 'Kuo', 'Ho']
    
    # randomly assigning given and last names
    female_patient_given_names = [random.choice(female_first_names) for _ in range(50)]
    female_patient_last_names  = [random.choice(female_last_names) for _ in range(50)]
    male_patient_given_names   = [random.choice(male_first_names) for _ in range(50)]
    male_patient_last_names    = [random.choice(male_last_names) for _ in range(50)]

    # generate date and time
    now = datetime.now()
    past_month = now - timedelta(days=30)

    dates = []
    for i in range(50):
        random_date = past_month + timedelta(days=random.randint(0, 30), 
                                              hours=random.randint(0, 23),
                                              minutes=random.randint(0, 59),
                                              seconds=random.randint(0, 59))
        dates.append(random_date.strftime("%Y-%m-%d %H:%M:%S"))

    for i, row in enumerate(patient_dictionaries):
        row['_id'] = patient_ids[i]
        row['patient_id'] = patient_ids[i]
        row['lab_results_date'] = dates[i]
        if row['gender'] == 'female':
            row['given_name'] = female_patient_given_names[i]
            row['last_name'] = female_patient_last_names[i]
        else:
            row['given_name'] = male_patient_given_names[i]
            row['last_name'] = male_patient_last_names[i]

    return patient_dictionaries


def add_stroke_risk_pred_scores(patient_dictionaries, X_subset_stroke_pred_score):
    for i, row in enumerate(patient_dictionaries):
        row['risk_score'] = X_subset_stroke_pred_score[i]
    return patient_dictionaries


########################################################################################################################################
# Home
########################################################################################################################################

@app.route('/')
def home():
    return "Welcome to the Stroke Prediction Application - Backend Application!"

########################################################################################################################################
# GET ALL BASIC PATIENT LIST from MONGODB (patient_data_collection)
########################################################################################################################################

@app.route('/getPatientList', methods=['GET'])
@cross_origin()
def get_all_basic_patient_list_from_db():

    documents = list(patient_data_collection.find({}))

    basic_patient_list = []
    for doc in documents:
        basic_patient_details = {'patient_id': doc['patient_id'], 'given_name': doc['given_name'],
                                 'last_name': doc['last_name'], 'gender': doc['gender'], 
                                 'age': doc['age'], 'lab_results_date': doc['lab_results_date'], 
                                 'risk_score': doc['risk_score']}
        basic_patient_list.append(basic_patient_details)

    return jsonify(basic_patient_list)

########################################################################################################################################
# GET DETAILED INFORMATION ABOUT A SINGLE PATIENT from MONGODB using PATIENT_ID
########################################################################################################################################

@app.route('/getDetailedInfo/<patient_id>', methods=['GET'])
@cross_origin()
def get_detailed_patient_info_from_db(patient_id):

    patient_detailed_info = patient_data_collection.find_one({'_id': patient_id})
    patient_detailed_info.pop('_id')

    return jsonify(patient_detailed_info)

########################################################################################################################################
# ADD 50 random PATIENT DETAILS from the TEST DATASET INTO MONGODB (patient_data_collection)
########################################################################################################################################

@app.route('/addPatientList', methods=['GET'])
@cross_origin()
def add_fifty_patients_list_into_db():

    # Select 50 random patients from test set
    indices = np.random.choice(len(X_test), size=50, replace=False)
    X_subset = X_test[indices]
    X_subset_stroke_pred_score = model.predict_proba(column_transformer.transform(X_subset))[:,1]
    X_subset_stroke_pred_score = np.round(X_subset_stroke_pred_score * 100, 2).tolist()

    patient_dictionaries = convert_into_mongoDB_dictionary(X_labels, X_subset)
    patient_dictionaries = add_patient_names_ids_and_test_dates(patient_dictionaries)
    patient_dictionaries = add_stroke_risk_pred_scores(patient_dictionaries, X_subset_stroke_pred_score)
    for patient_doc in patient_dictionaries:
        patient_data_collection.insert_one(patient_doc)

        if patient_doc['risk_score'] > RISK_TRHESHOLD:
            subject = f"High Stroke Risk in Patient {patient_doc['patient_id']}"
            context = (f"This is to inform you that our AI-powered stroke risk detection model has "
                        f"identified your patient {patient_doc['given_name']} {patient_doc['last_name']} "
                        f"(patient ID: {patient_doc['patient_id']}) as having a high risk of stroke with a "
                        f"risk percentage of {patient_doc['risk_score']}. "
                        f"Please schedule a follow-up appointment with the patient as soon as possible to discuss their "
                        f"stroke risk and develop a plan for mitigating it.")
            message_inbox = {"subject": subject, "context": context}
            provider_data_collection.insert_one(message_inbox)

    return jsonify({"message": "50 patient documents inserted or updated"})

########################################################################################################################################
# DELETE THE EXISTING PATIENT LIST FROM MONGODB (patient_data_collection)
########################################################################################################################################

@app.route('/deletePatientDetails', methods=['GET'])
@cross_origin()
def delete_all_patient_details_in_db():

    result = patient_data_collection.delete_many({})
    result2 = provider_data_collection.delete_many({})

    return jsonify({"message": f"{result.deleted_count} documents deleted"})


########################################################################################################################################
# Add a new patient with all their details into the database
########################################################################################################################################

@app.route('/addPatient', methods=['POST'])
@cross_origin()
def add_patient_to_db():
    patient_dict = request.get_json()
    def one_hot_encoding(value, column, SPECIAL_COLUMNS):
        encoding = []
        for key, (val, col) in SPECIAL_COLUMNS.items():
            if col == column:
                encoding.append(1 if val == value else 0)
        return encoding

    def convert_patient_dict_to_np_array(patient_dict, SPECIAL_COLUMNS):
        patient_list = []
        patient_list.extend([
            float(patient_dict['age']),
            float(patient_dict['avg_glucose_level']),
            float(patient_dict['bmi'])
        ])

        for key, (value, column) in SPECIAL_COLUMNS.items():
            if patient_dict[column] == value:
                patient_list.extend(one_hot_encoding(patient_dict[column], column, SPECIAL_COLUMNS))
                
        return np.array(patient_list)

    # Usage:
    np_array = convert_patient_dict_to_np_array(patient_dict, SPECIAL_COLUMNS)
    np_array_2d = np_array.reshape(1, -1)
    
    stroke_pred_score = model.predict_proba(column_transformer.transform(np_array_2d))[:,1]
    stroke_pred_score = np.round(stroke_pred_score  * 100, 2).tolist()
    stroke_pred_score_list = stroke_pred_score

    patient_dict['risk_score'] = stroke_pred_score[0]
    patient_dict['lab_results_date'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    patient_dict['patient_id'] = ''.join(random.choices('0123456789', k=8))
    patient_dict['_id'] = patient_dict['patient_id']

    # Add the patient data to the database
    result = patient_data_collection.insert_one(patient_dict)

    # Add message inbox to the provider collection if the stroke risk is above a certain threshold
    if stroke_pred_score[0] > RISK_TRHESHOLD:
        subject = f"High Stroke Risk in Patient {patient_dict['patient_id']}"
        context = (f"This is to inform you that our AI-powered stroke risk detection model has "
                    f"identified your patient {patient_dict['given_name']} {patient_dict['last_name']} "
                    f"(patient ID: {patient_dict['patient_id']}) as having a high risk of stroke with a "
                    f"risk percentage of {patient_dict['risk_score']}. "
                    f"Please schedule a follow-up appointment with the patient as soon as possible to discuss their "
                    f"stroke risk and develop a plan for mitigating it.")
        
        message_inbox = {"subject": subject, "context": context}
        result = provider_data_collection.insert_one(message_inbox)


    add_patient_response = patient_dict
    add_patient_response.pop('_id')
    return jsonify(add_patient_response)

########################################################################################################################################
# Get Message Inbox
########################################################################################################################################

@app.route('/getMessageInbox', methods=['GET'])
@cross_origin()
def get_message_inbox_of_the_provider():

    documents = list(provider_data_collection.find({}))

    message_inbox_list = []

    for doc in documents:
        message_inbox_list.append({'subject': doc['subject'],'context': doc['context']})

    return jsonify(message_inbox_list)

########################################################################################################################################
# Get Population Level Metrics
########################################################################################################################################

@app.route('/getPopulationLevelData', methods=['GET'])
@cross_origin()
def get_population_level_data():

    median = np.nanmedian(population_level_data["density_plot"]["bmi"])
    population_level_data["density_plot"]["bmi"] = [median if np.isnan(x) else x for x in population_level_data["density_plot"]["bmi"]]

    pop_level_data = population_level_data
    return jsonify(pop_level_data)

########################################################################################################################################
if __name__ == '__main__':
    app.run(port=config.get('Ports', 'back_end_port'))