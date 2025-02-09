import React, { useState, useEffect } from "react";
import { Container, Typography, AppBar } from "@mui/material";
import Navbar from "../components/Navbar";
import PatientBar from "../components/PatientBar";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const DoctorPage = () => {
  const { doctorId } = useParams();
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState(null); // Start as null
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  // This is now wrapped in useEffect to avoid fetching during render.
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch doctor and patient data concurrently
        const [doctorResponse, patientResponse] = await Promise.all([
          fetch("/doctordata.json"),
          fetch("/patientdata.json"),
        ]);

        const doctorData = await doctorResponse.json();
        const patientData = await patientResponse.json();

        const foundDoctor = doctorData.find((p) => p.user_id === doctorId);
        setDoctor(foundDoctor || null);

        if (foundDoctor) {
          // Only filter patients if the doctor is found
          const matchedPatients = patientData.filter((patient) =>
            foundDoctor.patients.includes(patient.user_id)
          );
          setPatients(matchedPatients);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false); // Set loading to false when data is loaded
      }
    };

    fetchData();
  }, [doctorId]); // Dependency array ensures this only runs when doctorId changes

  // Handle loading state
  if (loading) {
    return (
      <Container
        maxWidth="md"
        style={{ textAlign: "center", marginTop: "2rem" }}
      >
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  // Ensure doctor is loaded before rendering
  if (!doctor) {
    return (
      <Container
        maxWidth="md"
        style={{ textAlign: "center", marginTop: "2rem" }}
      >
        <Typography variant="h6" color="error">
          Doctor not found.
        </Typography>
      </Container>
    );
  }

  // Handle patient click and navigate to the patient's page
  const handlePatientClick = (patientId) => {
    navigate(`/patient/${patientId}`);
  };

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
          Welcome back, Dr. {doctor.firstName}!
        </Typography>
        {patients
          .sort((a, b) => {
            const lastNameA = a.personal_details.last_name.toLowerCase();
            const lastNameB = b.personal_details.last_name.toLowerCase();
            return lastNameA < lastNameB ? -1 : lastNameA > lastNameB ? 1 : 0;
          })
          .map((patient) => (
            <PatientBar
              key={patient.user_id}
              firstName={patient.personal_details.first_name}
              lastName={patient.personal_details.last_name}
              isOk={true} // Placeholder for `isOk` logic
              onClick={() => handlePatientClick(patient.user_id)} // Handle navigation on click
            />
          ))}
      </Container>
    </>
  );
};

export default DoctorPage;
