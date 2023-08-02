/// Gets population level statistics from the back-end using the getPopulationLevelData API
/// and generated relevant bar and scatter plots

import React from 'react';
import {
	CircularProgress,
    Typography
   } from '@mui/material';
import { BarChart, AreaChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

class PopulationStatistics extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loading : true,
        error : null,
        value : null
      };
    }
  
    componentDidMount() {
      this.getDetails();
    }
    getColour(score) {
      if (score <= 33.33) return "success";
      if (score <= 66.66) return "warning";
      return "error";
    }
  
    getDetails(){
      const url = 'https://stroke-prediction-app-backend.herokuapp.com/getPopulationLevelData';
      console.log('Fetching data');
      fetch(url).then(
        (resp) => resp.json())
        .then((resp) => {
          console.log("Data has been fetched successfully: ", resp);
          this.setState({
            value : resp,
            loading : false,
          });
        }
      ).catch(error => {
        console.log("ERROR:",error);
        this.setState({
          error : error,
          //value : sample,
          loading : false
        })
      })
    }



    render() {

      if (this.state.loading) {
        console.log('hello');
        return <CircularProgress></CircularProgress>;
      }
      if (this.state.error) {
        console.log(this.state.error.message);
        return this.state.error.message;
      }

      // Density plot caluclations
      // Function that calculates the frequency of strokes and non stroke cases given a distribution and bucket size
      function calculateBucketCounts(data, bucketSize) {
        return data.reduce((acc, d) => {
          const bucket = Math.floor(d.x / bucketSize) * bucketSize;
          const strokeCount = d.y === 1 ? 1 : 0;
          const nonStrokeCount = d.y === 0 ? 1 : 0;
          const bucketIndex = acc.findIndex(b => b.x === bucket);
          if (bucketIndex === -1) {
            acc.push({ x: bucket, y: strokeCount, z: nonStrokeCount });
          } else {
            acc[bucketIndex].y += strokeCount;
            acc[bucketIndex].z += nonStrokeCount;
          }
          return acc;
        }, []);
      }
      
      // Calculate bmi data
      const bmi_data = this.state.value["density_plot"]["bmi"]
        .map((x, i) => ({ x, y: this.state.value["density_plot"]["stroke"][i] }))
        .sort((a, b) => a.x - b.x);
      const bmi_bucketSize = 5;
      const bmi_bucketCounts = calculateBucketCounts(bmi_data, bmi_bucketSize);
      
      // Calculate avg glucose data
      const avg_glucose_data = this.state.value["density_plot"]["avg_glucose_level"]
        .map((x, i) => ({ x, y: this.state.value["density_plot"]["stroke"][i] }))
        .sort((a, b) => a.x - b.x);
      const avg_glucose_bucketSize = 20;
      const avg_glucose_bucketCounts = calculateBucketCounts(avg_glucose_data, avg_glucose_bucketSize);
      
      // Calculate age data
      const age_data = this.state.value["density_plot"]["age"]
        .map((x, i) => ({ x, y: this.state.value["density_plot"]["stroke"][i] }))
        .sort((a, b) => a.x - b.x);
      const age_bucketSize = 10;
      const age_bucketCounts = calculateBucketCounts(age_data, age_bucketSize);

      return (
        <div>
          <React.Fragment>
            <Typography variant="h5" align="left">Stroke Counts by Residence Type</Typography>
            <BarChart width={600} height={300} data={
              [
                { 
                  name: 'Rural', 
                  stroke_count: this.state.value["bar_plot"]["Residence_type"]["Rural"]["stroke_count"], 
                  non_stroke_count: this.state.value["bar_plot"]["Residence_type"]["Rural"]["non_stroke_count"] 
                },
                { 
                  name: 'Urban', 
                  stroke_count: this.state.value["bar_plot"]["Residence_type"]["Urban"]["stroke_count"], 
                  non_stroke_count: this.state.value["bar_plot"]["Residence_type"]["Urban"]["non_stroke_count"] },
              ]
            }>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="stroke_count" fill="#f44336" />
              <Bar dataKey="non_stroke_count" fill="lightgreen" />
            </BarChart>
          </React.Fragment>

          <React.Fragment>
            <Typography variant="h5" align="left">Stroke percentage by Residence Type</Typography>
            <BarChart width={600} height={300} data={[
                      { 
                        name: 'Rural', 
                        stroke_percentage: parseInt(this.state.value["bar_plot"]["Residence_type"]["Rural"]["stroke_per"].replace("%", "")),
                        non_stroke_percentage: parseInt(this.state.value["bar_plot"]["Residence_type"]["Rural"]["non_stroke_per"].replace("%", ""))
                      },
                      { 
                        name: 'Urban', 
                        stroke_percentage: parseInt(this.state.value["bar_plot"]["Residence_type"]["Urban"]["stroke_per"].replace("%", "")),
                        non_stroke_percentage: parseInt(this.state.value["bar_plot"]["Residence_type"]["Urban"]["non_stroke_per"].replace("%", ""))
                      },
              ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Legend />
              <Bar dataKey="stroke_percentage" fill="#f44336" stackId="a" />
              <Bar dataKey="non_stroke_percentage" fill="lightgreen" stackId="a" />
            </BarChart>
          </React.Fragment>

          <React.Fragment>
            <Typography variant="h5" align="left">Stroke counts by marital status</Typography>
            <BarChart width={600} height={300} data={
              [
                { 
                  name: 'Married', 
                  stroke_count: this.state.value["bar_plot"]["ever_married"]["Yes"]["stroke_count"], 
                  non_stroke_count: this.state.value["bar_plot"]["ever_married"]["Yes"]["non_stroke_count"] 
                },
                { 
                  name: 'Un-married', 
                  stroke_count: this.state.value["bar_plot"]["ever_married"]["No"]["stroke_count"], 
                  non_stroke_count: this.state.value["bar_plot"]["ever_married"]["No"]["non_stroke_count"]
                },
              ]
            }>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="stroke_count" fill="#f44336" />
              <Bar dataKey="non_stroke_count" fill="lightgreen" />
            </BarChart>
          </React.Fragment>

          <React.Fragment>
            <Typography variant="h5" align="left">Stroke percentage by marital status</Typography>
            <BarChart width={600} height={300} data={[
                      { 
                        name: 'Ever married: Yes', 
                        stroke_percentage: parseInt(this.state.value["bar_plot"]["ever_married"]["Yes"]["stroke_per"].replace("%", "")),
                        non_stroke_percentage: parseInt(this.state.value["bar_plot"]["ever_married"]["Yes"]["non_stroke_per"].replace("%", ""))
                      },
                      { 
                        name: 'Ever married: No', 
                        stroke_percentage: parseInt(this.state.value["bar_plot"]["ever_married"]["No"]["stroke_per"].replace("%", "")),
                        non_stroke_percentage: parseInt(this.state.value["bar_plot"]["ever_married"]["No"]["non_stroke_per"].replace("%", ""))
                      },
              ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Legend />
              <Bar dataKey="stroke_percentage" fill="#f44336" stackId="a" />
              <Bar dataKey="non_stroke_percentage" fill="lightgreen" stackId="a" />
            </BarChart>
          </React.Fragment>

          <React.Fragment>
            <Typography variant="h5" align="left">Stroke counts by Gender</Typography>
            <BarChart width={600} height={300} data={
              [
                { 
                  name: 'Male', 
                  stroke_count: this.state.value["bar_plot"]["gender"]["Male"]["stroke_count"], 
                  non_stroke_count: this.state.value["bar_plot"]["gender"]["Male"]["non_stroke_count"] 
                },
                { 
                  name: 'Female', 
                  stroke_count: this.state.value["bar_plot"]["gender"]["Female"]["stroke_count"], 
                  non_stroke_count: this.state.value["bar_plot"]["gender"]["Female"]["non_stroke_count"]
                },
              ]
            }>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="stroke_count" fill="#f44336" />
              <Bar dataKey="non_stroke_count" fill="lightgreen" />
            </BarChart>
          </React.Fragment>

          <React.Fragment>
            <Typography variant="h5" align="left">Stroke percentage by gender</Typography>
            <BarChart width={600} height={300} data={[
                      { 
                        name: 'Male', 
                        stroke_percentage: parseInt(this.state.value["bar_plot"]["gender"]["Male"]["stroke_per"].replace("%", "")),
                        non_stroke_percentage: parseInt(this.state.value["bar_plot"]["gender"]["Male"]["non_stroke_per"].replace("%", ""))
                      },
                      { 
                        name: 'Female', 
                        stroke_percentage: parseInt(this.state.value["bar_plot"]["gender"]["Female"]["stroke_per"].replace("%", "")),
                        non_stroke_percentage: parseInt(this.state.value["bar_plot"]["gender"]["Female"]["non_stroke_per"].replace("%", ""))
                      },
              ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Legend />
              <Bar dataKey="stroke_percentage" fill="#f44336" stackId="a" />
              <Bar dataKey="non_stroke_percentage" fill="lightgreen" stackId="a" />
            </BarChart>
          </React.Fragment>

          <React.Fragment>
            <Typography variant="h5" align="left">Stroke counts by Heart disease</Typography>
            <BarChart width={600} height={300} data={
              [
                { 
                  name: 'No', 
                  stroke_count: this.state.value["bar_plot"]["heart_disease"]["0"]["stroke_count"], 
                  non_stroke_count: this.state.value["bar_plot"]["heart_disease"]["0"]["non_stroke_count"] 
                },
                { 
                  name: 'Yes', 
                  stroke_count: this.state.value["bar_plot"]["heart_disease"]["1"]["stroke_count"], 
                  non_stroke_count: this.state.value["bar_plot"]["heart_disease"]["1"]["non_stroke_count"]
                },
              ]
            }>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="stroke_count" fill="#f44336" />
              <Bar dataKey="non_stroke_count" fill="lightgreen" />
            </BarChart>
          </React.Fragment>

          <React.Fragment>
            <Typography variant="h5" align="left">Stroke percentage by heart disease</Typography>
            <BarChart width={600} height={300} data={[
                      { 
                        name: 'No', 
                        stroke_percentage: parseInt(this.state.value["bar_plot"]["heart_disease"]["0"]["stroke_per"].replace("%", "")),
                        non_stroke_percentage: parseInt(this.state.value["bar_plot"]["heart_disease"]["0"]["non_stroke_per"].replace("%", ""))
                      },
                      { 
                        name: 'Yes', 
                        stroke_percentage: parseInt(this.state.value["bar_plot"]["heart_disease"]["1"]["stroke_per"].replace("%", "")),
                        non_stroke_percentage: parseInt(this.state.value["bar_plot"]["heart_disease"]["1"]["non_stroke_per"].replace("%", ""))
                      },
              ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Legend />
              <Bar dataKey="stroke_percentage" fill="#f44336" stackId="a" />
              <Bar dataKey="non_stroke_percentage" fill="lightgreen" stackId="a" />
            </BarChart>
          </React.Fragment>

          <React.Fragment>
            <Typography variant="h5" align="left">Stroke counts by Hypertension</Typography>
            <BarChart width={600} height={300} data={
              [
                { 
                  name: 'No', 
                  stroke_count: this.state.value["bar_plot"]["hypertension"]["0"]["stroke_count"], 
                  non_stroke_count: this.state.value["bar_plot"]["hypertension"]["0"]["non_stroke_count"] 
                },
                { 
                  name: 'Yes', 
                  stroke_count: this.state.value["bar_plot"]["hypertension"]["1"]["stroke_count"], 
                  non_stroke_count: this.state.value["bar_plot"]["hypertension"]["1"]["non_stroke_count"]
                },
              ]
            }>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="stroke_count" fill="#f44336" />
              <Bar dataKey="non_stroke_count" fill="lightgreen" />
            </BarChart>
          </React.Fragment>

          <React.Fragment>
            <Typography variant="h5" align="left">Stroke percentage by hypertension</Typography>
            <BarChart width={600} height={300} data={[
                      { 
                        name: 'No', 
                        stroke_percentage: parseInt(this.state.value["bar_plot"]["hypertension"]["0"]["stroke_per"].replace("%", "")),
                        non_stroke_percentage: parseInt(this.state.value["bar_plot"]["hypertension"]["0"]["non_stroke_per"].replace("%", ""))
                      },
                      { 
                        name: 'Yes', 
                        stroke_percentage: parseInt(this.state.value["bar_plot"]["hypertension"]["1"]["stroke_per"].replace("%", "")),
                        non_stroke_percentage: parseInt(this.state.value["bar_plot"]["hypertension"]["1"]["non_stroke_per"].replace("%", ""))
                      },
              ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Legend />
              <Bar dataKey="stroke_percentage" fill="#f44336" stackId="a" />
              <Bar dataKey="non_stroke_percentage" fill="lightgreen" stackId="a" />
            </BarChart>
          </React.Fragment>

          <React.Fragment>
            <Typography variant="h5" align="left">Stroke counts by smoking status</Typography>
            <BarChart width={600} height={300} data={
              [
                { 
                  name: 'Unknown', 
                  stroke_count: this.state.value["bar_plot"]["smoking_status"]["Unknown"]["stroke_count"], 
                  non_stroke_count: this.state.value["bar_plot"]["smoking_status"]["Unknown"]["non_stroke_count"] 
                },
                { 
                  name: 'Formerly smoked', 
                  stroke_count: this.state.value["bar_plot"]["smoking_status"]["formerly smoked"]["stroke_count"], 
                  non_stroke_count: this.state.value["bar_plot"]["smoking_status"]["formerly smoked"]["non_stroke_count"]
                },
                { 
                  name: 'Never smoked', 
                  stroke_count: this.state.value["bar_plot"]["smoking_status"]["never smoked"]["stroke_count"], 
                  non_stroke_count: this.state.value["bar_plot"]["smoking_status"]["never smoked"]["non_stroke_count"]
                },
                { 
                  name: 'Smokes', 
                  stroke_count: this.state.value["bar_plot"]["smoking_status"]["smokes"]["stroke_count"], 
                  non_stroke_count: this.state.value["bar_plot"]["smoking_status"]["smokes"]["non_stroke_count"]
                },
              ]
            }>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="stroke_count" fill="#f44336" />
              <Bar dataKey="non_stroke_count" fill="lightgreen" />
            </BarChart>
          </React.Fragment>

          <React.Fragment>
            <Typography variant="h5" align="left">Stroke percentage by smoking status</Typography>
            <BarChart width={600} height={300} data={[
                { 
                  name: 'Unknown', 
                  stroke_percentage: parseInt(this.state.value["bar_plot"]["smoking_status"]["Unknown"]["stroke_per"].replace("%", "")), 
                  non_stroke_percentage: parseInt(this.state.value["bar_plot"]["smoking_status"]["Unknown"]["non_stroke_per"].replace("%", "")) 
                },
                { 
                  name: 'Formerly smoked', 
                  stroke_percentage: parseInt(this.state.value["bar_plot"]["smoking_status"]["formerly smoked"]["stroke_per"].replace("%", "")), 
                  non_stroke_percentage: parseInt(this.state.value["bar_plot"]["smoking_status"]["formerly smoked"]["non_stroke_per"].replace("%", ""))
                },
                { 
                  name: 'Never smoked', 
                  stroke_percentage: parseInt(this.state.value["bar_plot"]["smoking_status"]["never smoked"]["stroke_per"].replace("%", "")), 
                  non_stroke_percentage: parseInt(this.state.value["bar_plot"]["smoking_status"]["never smoked"]["non_stroke_per"].replace("%", ""))
                },
                { 
                  name: 'Smokes', 
                  stroke_percentage: parseInt(this.state.value["bar_plot"]["smoking_status"]["smokes"]["stroke_per"].replace("%", "")), 
                  non_stroke_percentage: parseInt(this.state.value["bar_plot"]["smoking_status"]["smokes"]["non_stroke_per"].replace("%", ""))
                },
              ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Legend />
              <Bar dataKey="stroke_percentage" fill="#f44336" stackId="a" />
              <Bar dataKey="non_stroke_percentage" fill="lightgreen" stackId="a" />
            </BarChart>
          </React.Fragment>

          <React.Fragment>
            <Typography variant="h5" align="left">Stroke counts by work type</Typography>
            <BarChart width={600} height={300} data={
              [
                { 
                  name: 'Gov. job', 
                  stroke_count: this.state.value["bar_plot"]["work_type"]["Govt_job"]["stroke_count"], 
                  non_stroke_count: this.state.value["bar_plot"]["work_type"]["Govt_job"]["non_stroke_count"] 
                },
                { 
                  name: 'Never worked', 
                  stroke_count: this.state.value["bar_plot"]["work_type"]["Never_worked"]["stroke_count"], 
                  non_stroke_count: this.state.value["bar_plot"]["work_type"]["Never_worked"]["non_stoke_count"]
                },
                { 
                  name: 'Private', 
                  stroke_count: this.state.value["bar_plot"]["work_type"]["Private"]["stroke_count"], 
                  non_stroke_count: this.state.value["bar_plot"]["work_type"]["Private"]["non_stroke_count"]
                },
                { 
                  name: 'Self-employed', 
                  stroke_count: this.state.value["bar_plot"]["work_type"]["Self-employed"]["stroke_count"], 
                  non_stroke_count: this.state.value["bar_plot"]["work_type"]["Self-employed"]["non_stroke_count"]
                },
                { 
                  name: 'Minor', 
                  stroke_count: this.state.value["bar_plot"]["work_type"]["children"]["stroke_count"], 
                  non_stroke_count: this.state.value["bar_plot"]["work_type"]["children"]["non_stroke_count"]
                },
              ]
            }>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="stroke_count" fill="#f44336" />
              <Bar dataKey="non_stroke_count" fill="lightgreen" />
            </BarChart>
          </React.Fragment>

          <React.Fragment>
            <Typography variant="h5" align="left">Stroke percentage by work type</Typography>
            <BarChart width={600} height={300} data={[
                { 
                  name: 'Gov. job', 
                  stroke_percentage: parseInt(this.state.value["bar_plot"]["work_type"]["Govt_job"]["stroke_per"].replace("%", "")), 
                  non_stroke_percentage: parseInt(this.state.value["bar_plot"]["work_type"]["Govt_job"]["non_stroke_per"].replace("%", "")) 
                },
                { 
                  name: 'Never worked', 
                  stroke_percentage: parseInt(this.state.value["bar_plot"]["work_type"]["Never_worked"]["stroke_per"].replace("%", "")), 
                  non_stroke_percentage: parseInt(this.state.value["bar_plot"]["work_type"]["Never_worked"]["non_stroke_per"].replace("%", ""))
                },
                { 
                  name: 'Private', 
                  stroke_percentage: parseInt(this.state.value["bar_plot"]["work_type"]["Private"]["stroke_per"].replace("%", "")), 
                  non_stroke_percentage: parseInt(this.state.value["bar_plot"]["work_type"]["Private"]["non_stroke_per"].replace("%", ""))
                },
                { 
                  name: 'Self-employed', 
                  stroke_percentage: parseInt(this.state.value["bar_plot"]["work_type"]["Self-employed"]["stroke_per"].replace("%", "")), 
                  non_stroke_percentage: parseInt(this.state.value["bar_plot"]["work_type"]["Self-employed"]["non_stroke_per"].replace("%", ""))
                },
                { 
                  name: 'Minor', 
                  stroke_percentage: parseInt(this.state.value["bar_plot"]["work_type"]["children"]["stroke_per"].replace("%", "")), 
                  non_stroke_percentage: parseInt(this.state.value["bar_plot"]["work_type"]["children"]["non_stroke_per"].replace("%", ""))
                },
              ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Legend />
              <Bar dataKey="stroke_percentage" fill="#f44336" stackId="a" />
              <Bar dataKey="non_stroke_percentage" fill="lightgreen" stackId="a" />
            </BarChart>
          </React.Fragment>

          <React.Fragment>
          <Typography variant="h5" align="left">Stroke vs BMI Density Plot</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={bmi_bucketCounts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" name="BMI" />
              <YAxis dataKey="y" name="Density" />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="z" data={bmi_bucketCounts.z} name="Non-Stroke" stroke="lightgreen" fill="lightgreen" />
              <Area type="monotone" dataKey="y" data={bmi_bucketCounts.y} name="Stroke" stroke="#f44336" fill="red" />
            </AreaChart>
          </ResponsiveContainer>
        </React.Fragment>

        <React.Fragment>
          <Typography variant="h5" align="left">Stroke vs Avg glucose level Density Plot</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={avg_glucose_bucketCounts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" name="BMI" />
              <YAxis dataKey="y" name="Density" />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="z" data={avg_glucose_bucketCounts.z} name="Non-Stroke" stroke="lightgreen" fill="lightgreen" />
              <Area type="monotone" dataKey="y" data={avg_glucose_bucketCounts.y} name="Stroke" stroke="#f44336" fill="red" />
            </AreaChart>
          </ResponsiveContainer>
        </React.Fragment>

        <React.Fragment>
          <Typography variant="h5" align="left">Stroke vs age Density Plot</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={age_bucketCounts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" name="BMI" />
              <YAxis dataKey="y" name="Density" />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="z" data={age_bucketCounts.z} name="Non-Stroke" stroke="lightgreen" fill="lightgreen" />
              <Area type="monotone" dataKey="y" data={age_bucketCounts.y} name="Stroke" stroke="#f44336" fill="red" />
            </AreaChart>
          </ResponsiveContainer>
        </React.Fragment>
        </div>
      );
    }
  }

export default PopulationStatistics;