import React from 'react';
import { Container, Typography, Grid, TextField, Button, MenuItem } from '@mui/material'


const BasicInfo = ({nextPage, handleChange, values}) => {

    const genders = [
      {
        value: 'male',
        label: 'Male',
      },
      {
        value: 'female',
        label: 'Female',
      },
    ];

    // for continue event listener
    const Forward = e => {
        e.preventDefault();
        nextPage();
    }

    return (
        <Container  component="main" maxWidth="xs" sx={{ mb: '2%' }}>
      <div>
        <Typography  component="h1" variant="h5">
          Create New Patient
        </Typography>
        <form>
          <Grid container spacing={2}>
              {/* First Name */}
              <Grid item xs={12}>
                <TextField 
                  placeholder="First Name"
                  label="First Name"
                  onChange={handleChange('firstname')}
                  defaultValue={values.firstname}
                  fullWidth
                />
              </Grid>
              <br />
              {/* Last Name */}
              <Grid item xs={12}>
                <TextField 
                  placeholder="Last Name"
                  label="Last Name"
                  onChange={handleChange('lastname')}
                  defaultValue={values.lastname}
                  fullWidth
                />
              </Grid>
              <br />
              {/* email */}
              <Grid item xs={12}>
                <TextField 
                  placeholder="Email Address"
                  label="Email Address"
                  onChange={handleChange('email')}
                  defaultValue={values.email}
                  fullWidth
                />
              </Grid>
              <br />
              {/* gender */}
              <Grid item xs={12}>
                <TextField
                  id="outlined-select-currency"
                  select
                  label="Gender"
                  onChange={handleChange('gender')}
                  fullWidth
                >
                  {genders.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <br />
              {/* Age, to be replaced with Date of Birth */}
              <Grid item xs={12}>
              <TextField 
                  label="Age"
                  onChange={handleChange('age')}
                  defaultValue={values.age}
                  fullWidth
                  type="number"
                />
              </Grid>
          </Grid>
          <br />
          <Button 
            onClick={ Forward }
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Next
          </Button>
        </form>
      </div>
    </Container>
    )

}

/*
  <Grid item xs={12}>
  <LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker
    label="Date of Birth"
    value={values.dob}
    defaultValue={dayjs()}
    onChange={handleChange('dob')}
    fullWidth
  />
  </LocalizationProvider>
</Grid>
*/

export default BasicInfo;