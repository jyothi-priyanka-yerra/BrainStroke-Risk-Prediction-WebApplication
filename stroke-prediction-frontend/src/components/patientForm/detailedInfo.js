import React from 'react';
import { Container, Typography, Grid, TextField, Button, MenuItem } from '@mui/material'

const Details = ({prevPage, nextPage, handleChange, values}) => {

  const yesNo = [
    {
      value: 'yes',
      label: 'Yes',
    },
    {
      value: 'no',
      label: 'No',
    }
  ];

  const residenceStat = [
    {
      value: 'urban',
      label: 'Urban',
    },
    {
      value: 'rural',
      label: 'Rural',
    },

  ];

  const smokingStat = [
    {
      value: 'never smoked',
      label: 'Never Smoked',
    },
    {
      value: 'formerly smoked',
      label: 'Formerly Smoked',
    },
    {
      value: 'smokes',
      label: 'Smokes',
    },
    {
      value: 'unknown',
      label: 'Unknown'
    }
  ];

  const workType = [
    {
      value: 'private',
      label: 'Private',
    },
    {
      value: 'self employed',
      label: 'Self-employed',
    },
    {
      value: 'government',
      label: 'Government Job',
    },
    {
      value: 'children',
      label: 'Children'
    },
    {
      value: 'never worked',
      label: 'Never Worked',
    }
  ];

  // for continue event listener
    const Forward = e => {
      e.preventDefault();
      nextPage();
    }

    // for continue event listener
    const Backward = e => {
      e.preventDefault();
      prevPage();
    }

    return (
        <Container  component="main" maxWidth="xs" sx={{ mb: '2%' }}>
      <div>
        <Typography  component="h1" variant="h5">
          Create New Patient 
        </Typography>
        <form>
          <Grid container spacing={2}>
              {/* Hypertension */}
              <Grid item xs={12}>
                <TextField
                  id="outlined-select-currency"
                  select
                  label="Hypertension"
                  onChange={handleChange('hypertension')}
                  fullWidth
                >
                  {yesNo.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <br />
              {/* Married */}
              <Grid item xs={12}>
              <TextField
                  id="outlined-select-currency"
                  select
                  label="Ever Married"
                  onChange={handleChange('married')}
                  fullWidth
                >
                  {yesNo.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <br />
              {/* Residence Type */}
              <Grid item xs={12}>
                <TextField
                  id="outlined-select-currency"
                  select
                  label="Residence Type"
                  onChange={handleChange('residence')}
                  fullWidth
                >
                  {residenceStat.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <br />
              {/* Smoking Status */}
              <Grid item xs={12}>
              <TextField
                  id="outlined-select-currency"
                  select
                  label="Smoking Status"
                  onChange={handleChange('smoking')}
                  fullWidth
                >
                  {smokingStat.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <br />
              {/* Heart Disease */}
              <Grid item xs={12}>
                <TextField
                  id="outlined-select-currency"
                  select
                  label="Heart Disease"
                  onChange={handleChange('heart')}
                  fullWidth
                >
                  {yesNo.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              {/* Work Type */}
              <Grid item xs={12}>
              <TextField
                  id="outlined-select-currency"
                  select
                  label="Work Type"
                  onChange={handleChange('work')}
                  fullWidth
                >
                  {workType.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              {/* Average Glucose Level */}
              <Grid item xs={12}>
                <TextField 
                  placeholder="Average Glucose Level"
                  label="Average Glucose Level"
                  onChange={handleChange('glucose')}
                  defaultValue={values.glucose}
                  fullWidth
                  type="number"
                />
              </Grid>
              {/* BMI */}
              <Grid item xs={12}>
                <TextField 
                  placeholder="BMI"
                  label="BMI"
                  onChange={handleChange('bmi')}
                  defaultValue={values.bmi}
                  fullWidth
                  type="number"
                />
              </Grid>
          </Grid>
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
              onClick={ Forward }
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Confirm
            </Button>
          </Grid>
        </Grid>
        </form>
      </div>
    </Container>
    )

}

export default Details;