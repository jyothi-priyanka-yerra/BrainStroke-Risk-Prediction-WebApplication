# stroke_prediction_web_app

1. Perform Git clone "......." 
2. go to ..../stroke_prediction_web_app path
3. Open command prompt and execute "pip install -r requirements.txt"
4. execute "py stroke_prediction_application.py" then go to "http://localhost:8082/" on your browser ---> This is your MAIN APPLICATION PORT (8082)
5. Open another terminal in the same location 
6. execute "py backend_main_app.py" then go to "http://localhost:8084/getPatientList" on your browser ---> This is your BACKEND PORT (8084)
7. Similarly, you can execute all the operations using this 8084 port as shown at the bottom of the page.



## requirements.txt
If you add any code that requires installing further libraries, perform the following in the main path
1. pip install “….”
2. pip freeze > requirements.txt


## stroke_prediction_application.py
Wanted to make this as a common point to run which can host both backend and front end on difefrent ports. This is a placeholder. Couldn't figure a way to do without errors!


## app_configurations (NOTE: Please add any configurations here when you write the code)
All the end points (ex: mongoDB and ports) can be found in "app_configurations"
Added this so that we can just change the end point here when we deploy on cloud


## Front end:
1. Add the code in "ui_main.js" file and run the application on port 8083 which can be seen in "app_configurations" file
2. You can access the backend endpoints on PORT 8084 which is also configured in "app_configurations" file


## Back end:
1. Add the code in "backend_main_app.py" file.


# END POINT STEPS TO TEST THE FLOW:

Below 1 and 2 are for adding docuemnts into MongoDB (no need to call these from UI)

1. /deletePatientDetails
<img width="692" alt="1" src="https://github.gatech.edu/storage/user/57037/files/7d3d1032-5c8d-4cc4-8dd9-f9f4148c63bd">

2. [GET] /addPatientList
<img width="690" alt="image" src="https://github.gatech.edu/storage/user/57037/files/97a242a3-959c-42c2-80e8-2295e162eacc">

3. [GET] /getPatientList
This will get a list of 50 patients’ info basic info with “risk_score”
<img width="960" alt="image" src="https://github.gatech.edu/storage/user/57037/files/48fd5d6c-1a02-4716-af0b-297aa389dd3f">

4. [GET] /getDetailedInfo/<patient_id>
Take one “patient_id” from call 3. /getPatientList and add this in the 4. URL, you will get detailed info of the patient with “risk_score”
<img width="958" alt="image" src="https://github.gatech.edu/storage/user/57037/files/0cb63576-3e02-4335-8f2c-8e2eea203355">

5. [POST] /addPatient along with the request body
<img width="627" alt="image" src="https://github.gatech.edu/storage/user/57037/files/cf60c3e6-78a4-4f80-8a86-a0d1be3fc127">

6. [GET] /getMessageInbox   [to check the messages of the provider]
<img width="910" alt="image" src="https://github.gatech.edu/storage/user/57037/files/4964bd64-d204-4d44-8f73-1fed8bf7e5fd">

7. [GET] /getPopulationLevelData [to get the data to plot statistics on UI]
<img width="960" alt="image" src="https://github.gatech.edu/storage/user/57037/files/dd8e7b97-283e-4592-b0d8-09ebee136903">

