from fhirclient.models import patient, extension, fhirreference, humanname, fhirdate, quantity

# Create a new patient resource
p = patient.Patient()

# Set the patient's age
p.birthDate = fhirdate.FHIRDate("1972-04-16")

# Set the patient's name
name = humanname.HumanName()
name.family = "Doe"
name.given = ["John"]
p.name = [name]

# Set the patient's BMI
bmi = quantity.Quantity()
bmi.value = 30.5
bmi.unit = "kg/m2"
bmi_ext = extension.Extension()
bmi_ext.url = "http://hl7.org/fhir/StructureDefinition/patient-bmi"
bmi_ext.valueQuantity = bmi
p.extension = [bmi_ext]

# Set the patient's average glucose level
avg_glucose_level = quantity.Quantity()
avg_glucose_level.value = 72.62
avg_glucose_level.unit = "mg/dL"
avg_glucose_level_ext = extension.Extension()
avg_glucose_level_ext.url = "http://hl7.org/fhir/StructureDefinition/patient-averageGlucoseLevel"
avg_glucose_level_ext.valueQuantity = avg_glucose_level
p.extension.append(avg_glucose_level_ext)

# Print the patient resource in JSON format
print(p.as_json())