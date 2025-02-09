import React, { useState, useEffect } from "react";
import { Container, Typography, AppBar } from "@mui/material";
import Navbar from "../components/Navbar";
import PatientBar from "../components/PatientBar";
import { useNavigate, useParams } from "react-router-dom";

const DoctorPage = () => {
  const { doctorId } = useParams();
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();
  const [clickedPatient, setClickedPatient] = useState(null); // Track clicked patient ID

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorResponse, patientResponse] = await Promise.all([
          fetch("/doctordata.json"),
          fetch("/patientdata.json"),
        ]);

        const doctorData = await doctorResponse.json();
        const patientData = await patientResponse.json();

        const foundDoctor = doctorData.find((p) => p.user_id === doctorId);
        setDoctor(foundDoctor || null);

        if (foundDoctor) {
          const matchedPatients = patientData.filter((patient) =>
            foundDoctor.patients.includes(patient.user_id)
          );
          setPatients(matchedPatients);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [doctorId]);

  if (loading) {
    return (
      <Container maxWidth="md" style={{ textAlign: "center", marginTop: "2rem" }}>
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  if (!doctor) {
    return (
      <Container maxWidth="md" style={{ textAlign: "center", marginTop: "2rem" }}>
        <Typography variant="h6" color="error">
          Doctor not found.
        </Typography>
      </Container>
    );
  }

  // Handle patient click
  const handlePatientClick = (patientId) => {
    setClickedPatient(patientId); // Track the clicked patient
    setTimeout(() => {
      setClickedPatient(null); // Reset effect after a short delay
      navigate(`/patient/${patientId}`);
    }, 200);
  };

  return (
    <>
      <AppBar position="static">
        <Navbar />
      </AppBar>
      <Container maxWidth="md" style={{ textAlign: "center", marginTop: "2rem" }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {doctor.firstName}!
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
              isOk={patient.is_ok}
              isClicked={clickedPatient === patient.user_id} // Pass click effect
              onClick={() => handlePatientClick(patient.user_id)}
            />
          ))}
      </Container>
    </>
  );
};

export default DoctorPage;
