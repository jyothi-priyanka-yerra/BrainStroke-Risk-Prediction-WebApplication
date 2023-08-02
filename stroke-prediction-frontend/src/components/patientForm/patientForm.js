import React from 'react';
import BasicInfo from './basicInfo';
import Details from './detailedInfo';
import Confirmation from './confirmation';
import { 
	CircularProgress, } from '@mui/material';
import { Navigate } from 'react-router-dom';

const Success = ({values, respStuff, reqSentFun, respRecv, errorMsg}) => {


    if(respStuff.reqSent === false){
        const url = 'https://stroke-prediction-app-backend.herokuapp.com/addPatient';
        console.log('Sending Post Request');
        reqSentFun();
        fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            given_name: values.firstname,
            last_name: values.lastname,
            email: values.email,
            gender: values.gender,
            hypertension: values.hypertension,
            ever_married: values.married,
            residence_type: values.residence,
            smoking_status: values.smoking,
            heart_disease: values.heart,
            work_type: values.work,
            avg_glucose_level: values.glucose,
            bmi: values.bmi,
            age: values.age,
        })
        })
        .then(response => response.json())
        .then(response => respRecv(response))
        .catch(error => {
            console.log("ERROR:",error);
            errorMsg(error);
        })
    }
    
    if (respStuff.loading === true){
        return (
            <div>
                <div>
                    Processing Request
                </div>
                <br />
                <div>
                    <CircularProgress></CircularProgress>
                </div>
            </div>
        )
    }
    else if (respStuff.error === ''){
        return (
            <div>
                <Navigate to={`/patients/${respStuff.idRoute}`} />
            </div>
        )
    }
    else{
        return (
            <div>
                Error while creating patient. Please try again later. Error: {respStuff.error}
            </div>
        )
    }
    
}

class PatientForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            firstname: '',
            lastname: '',
            email: '',
            gender: '',
            hypertension: '',
            married: '',
            residence: '',
            smoking: '',
            heart: '',
            work: '',
            glucose: '',
            bmi: '',
            age: '',
            reqSent: false,
            loading: true,
            error: '',
            idRoute: 0,
        };
    }

    prevPage = () => {
        const { step } = this.state;
        this.setState({step: step - 1});
    }

    nextPage = () => {
        const { step } = this.state;
        this.setState({step: step + 1});
    }

    handleChange = input => e => {
        this.setState({ [input]: e.target.value });
    }

    reqSentFun = () => {
        this.setState({ loading: true, error: '', reqSent: true });
    }

    respRecv = (response) => {
        this.setState({ loading: false, error: '', reqSent: true, idRoute: response.patient_id });
        console.log(response);
    }

    errorMsg = (error) => {
        this.setState({loading: false, error: error, reqSent: true});
    }

    render(){
        const { step } = this.state;
        const { firstname, lastname, email, gender, dob, hypertension, married, residence,
                smoking, heart, work, glucose, bmi, age, loading, error, reqSent, idRoute } = this.state;
        const values = { firstname, lastname, email, gender, dob, hypertension, married,
                            residence, smoking, heart, work, glucose, bmi, age };
        const respStuff = { loading, error, reqSent, idRoute };
        switch (step) {
            case 1: 
                return (
                <BasicInfo 
                    nextPage={this.nextPage}
                    handleChange={this.handleChange}
                    values={values}
                />
                )
            case 2: 
                return (
                <Details 
                    prevPage={this.prevPage}
                    nextPage={this.nextPage}
                    handleChange={this.handleChange}
                    values={values}
                />
                )
            case 3:
                return (
                <Confirmation 
                    prevPage={this.prevPage}
                    nextPage={this.nextPage}
                    values={values}
                />
                )
            case 4:
                return (
                    <Success 
                        values = {values}
                        respStuff = {respStuff}
                        reqSentFun={this.reqSentFun}
                        respRecv={this.respRecv}
                        errorMsg={this.errorMsg}
                    />
                )
            default: 
                
            }
    }

}

export default PatientForm;