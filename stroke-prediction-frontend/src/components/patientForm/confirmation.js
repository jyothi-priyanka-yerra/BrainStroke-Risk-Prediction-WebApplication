import React from 'react';
import { Container, List, Grid, ListItem, ListItemText, Button } from '@mui/material'

const Confirmation = ({prevPage, nextPage, values}) => {
    // for continue event listener
    const Create = e => {
        e.preventDefault();
        nextPage();
    }

    // for continue event listener
    const Backward = e => {
        e.preventDefault();
        prevPage();
    }

    return (
        <Container  component="main" maxWidth="xs" sx={{ border: 1, mb: '2%', pb: "1%"}}>
      <div>
        <List>
          <ListItem>
            <ListItemText primary="First Name" secondary={values.firstname}/>
          </ListItem>
          <ListItem>
            <ListItemText primary="Last Name" secondary={values.lastname}/>
          </ListItem>
          <ListItem>
            <ListItemText primary="Email Address" secondary={values.email}/>
          </ListItem>
          <ListItem>
            <ListItemText primary="Gender" secondary={values.gender}/>
          </ListItem>
          <ListItem>
            <ListItemText primary="Age" secondary={values.age}/>
          </ListItem>
        </List>
        <br />
        <List>
          <ListItem>
            <ListItemText primary="Hypertension" secondary={values.hypertension}/>
          </ListItem>
          <ListItem>
            <ListItemText primary="Ever Married" secondary={values.married}/>
          </ListItem>
          <ListItem>
            <ListItemText primary="Residence Type" secondary={values.residence}/>
          </ListItem>
          <ListItem>
            <ListItemText primary="Smoking Status" secondary={values.smoking}/>
          </ListItem>
          <ListItem>
            <ListItemText primary="Heart Disease" secondary={values.heart}/>
          </ListItem>
          <ListItem>
            <ListItemText primary="Work Type" secondary={values.work}/>
          </ListItem>
          <ListItem>
            <ListItemText primary="Average Glucose Level" secondary={values.glucose}/>
          </ListItem>
          <ListItem>
            <ListItemText primary="BMI" secondary={values.bmi}/>
          </ListItem>
        </List>

        <br />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button 
              onClick={ Backward }
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Previous
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button 
              onClick={ Create }
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Confirm
            </Button>
          </Grid>
        </Grid>
      </div>
    </Container>
    )
}

export default Confirmation