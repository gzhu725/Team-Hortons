//patient data page
import React, { useState, useEffect } from "react";
import { Container, Typography, AppBar } from "@mui/material";
import Navbar from "../components/Navbar";
import PatientBar from "../components/PatientBar";

const DoctorPage = () => {

  // TO DO HOW DO WE HANDLE SETTING DOCTOR? 

  const [doctor, setDoctor] = useState(""); //one entry from the doctor json file
  const [patients, setPatients] = useState([]);
  //CHANGE FOR LATER
  useEffect(() => {
    // Fetch doctor data
    fetch("/doctordata.json")
      .then((response) => response.json())
      .then((data) => {
        const doctorData = data[0]; // Assume first doctor entry
        setDoctor(doctorData);

        // Fetch patient data once doctor is loaded
        fetch("/patientdata.json")
          .then((response) => response.json())
          .then((patientData) => {
            // Match doctor’s patients with full patient records
            const matchedPatients = patientData.filter((patient) =>
              doctorData.patients.includes(patient.user_id)
            );
            setPatients(matchedPatients);
          })
          .catch((error) =>
            console.error("Error loading patient data:", error)
          );
      })
      .catch((error) => console.error("Error loading doctor data:", error));
  }, []);

  console.log(patients);

  return (
    <>
      <AppBar position="static">
        <Navbar />
      </AppBar>
      <Container
        maxWidth="md"
        style={{ textAlign: "center", marginTop: "2rem" }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome back, {doctor.firstName}!
        </Typography>
        {patients
          .sort((a, b) => {
            // Compare last names case-insensitively
            const lastNameA = a.personal_details.last_name.toLowerCase();
            const lastNameB = b.personal_details.last_name.toLowerCase();
            return lastNameA < lastNameB ? -1 : lastNameA > lastNameB ? 1 : 0;
          })
          .map((patient) => (
            <PatientBar
              key={patient.user_id}
              firstName={patient.personal_details.first_name}
              lastName={patient.personal_details.last_name}
              isOk={true} // TO DO WHAT IS THIS?
            />
          ))}
      </Container>
    </>
  );
};

export default DoctorPage;
