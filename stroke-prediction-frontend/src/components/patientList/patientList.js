import React from 'react';
import { 
	Box,
	CircularProgress,
	Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography, } from '@mui/material';
import {Link} from "react-router-dom";


class Dashboard extends React.Component {
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
      if (score <= 55.00) return "warning";
      return "error";
    }
  
    getDetails(){
      const url = 'https://stroke-prediction-app-backend.herokuapp.com/getPatientList';
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
      return (
        <Card>
          <Box >
          <Typography
            color="textPrimary"
            variant="h4"
          >
            Patient List
          </Typography>
          <Typography
            variant="h6"
            color="textSecondary"
          >
            ({this.state.value.length} available patients)
          </Typography>
          </Box>
          <Box sx={{ minWidth: 1050 }}>
            <Table>
              <TableHead sx={{textAlign: 'right'}}>
                <TableRow sx = {{bgcolor:"#BFDDBF"}}>
                  <TableCell >
                    Patient Name
                  </TableCell>
                  <TableCell>
                    Patient ID
                  </TableCell>
                  <TableCell>
                    Age
                  </TableCell>
                  <TableCell>
                    Gender
                  </TableCell>
                  <TableCell>
                    Lab Results Date
                  </TableCell>
                  <TableCell>
                    Risk Score
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.value.map((person) => (
                  <TableRow
                    hover
                    key={person._id}
                    onClick={() => console.log(person._id)}
                    
                  >
                    <TableCell>
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex'
                        }}
                      >
                        <Typography
                          color="textPrimary"
                          variant="body1"
                        >
                            <Link to={`/patients/${person.patient_id}`}>{person.given_name} {person.last_name}</Link>
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {person.patient_id}
                    </TableCell>
                    <TableCell>
                      {person.age}
                    </TableCell>
                    <TableCell>
                      {person.gender}
                    </TableCell>
                    <TableCell>
                      {person.lab_results_date}
                    </TableCell>
                    <TableCell>
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                      <CircularProgress variant="determinate" thickness={5} size="50px" value={person.risk_score} color={this.getColour(person.risk_score)}/>
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {`${Math.round(person.risk_score)}%`}
                      </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
  
      </Card>
      );
    }
  }

export default Dashboard;