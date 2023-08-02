import React from 'react';
import {Card, Grid, Typography, CircularProgress} from '@mui/material';
import {useParams} from "react-router-dom";


// Ref: https://stackoverflow.com/questions/58548767/react-router-dom-useparams-inside-class-component
function withParams(Component) {
    return props => <Component {...props} params={useParams()}/>;
}

class PatientDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: null,
            patient: null,
            patient_id: null,
        };
    }

    componentDidMount() {
        this.getDetails();
    }
    getColour(score) {
        if (score <= 33.33) return "success";
        if (score <= 55.00) return "warning";
        return "error";
      }

    getDetails() {
        // make API call to get patient data using this.props.params
        // update state with patient data
        let {id} = this.props.params;
        console.log('Patient id: ', id);
        this.setState({
            patient_id: id
        })
        const url = `https://stroke-prediction-app-backend.herokuapp.com//getDetailedInfo/${id}`;
        fetch(url).then(
            (resp) => resp.json())
            .then((resp) => {
                    console.log("Patient details has been fetched successfully: ", resp);
                    this.setState({
                        patient: resp,
                        loading: false,
                    });
                }
            ).catch(error => {
            console.log("ERROR:", error);
            this.setState({
                error: error,
                loading: false
            })
        })
    }

    render() {
        const {patient} = this.state;
        if (!patient) {
            return <div>Loading...<CircularProgress></CircularProgress></div>;
        }
        return (
            <Card variant="outlined">
                <h1>Patient Details</h1>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h4" component="h2">{patient.given_name} {patient.last_name}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={6}>
                                <Typography>Gender: {patient.gender}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>Age: {patient.age}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>Residence Type: {patient.residence_type}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>Hypertension: {patient.hypertension}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>Work Type: {patient.work_type}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>Heart Disease: {patient.heart_disease}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>Avg. Glucose Level: {patient.avg_glucose_level}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>Married: {patient.ever_married}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>BMI: {patient.bmi}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>Smoking Status: {patient.smoking_status}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h5">Risk of Stroke</Typography>
                        <Typography variant="h4">{patient.risk_score.toFixed(2)}%</Typography>
                        <CircularProgress variant="determinate"
                                          thickness={5}
                                          size={60}
                                          value={patient.risk_score}
                                          color={this.getColour(patient.risk_score)}></CircularProgress>
                    </Grid>
                </Grid>
            </Card>

        );
    }
}


// export default PatientDetail;
export default withParams(PatientDetail)