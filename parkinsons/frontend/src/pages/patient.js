import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AppBar,
  Box,
  Container,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
} from "@mui/material";
import Navbar from "../components/Navbar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import TremorChart from "../components/TremorChart";

const PatientPage = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  useEffect(() => {
    fetch("/patientdata.json")
      .then((response) => response.json())
      .then((data) => {
        const foundPatient = data.find((p) => p.user_id === patientId);
        setPatient(foundPatient || null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading JSON:", error);
        setLoading(false);
      });
  }, [patientId]);

  if (loading) {
    return (
      <Container
        maxWidth="md"
        style={{ textAlign: "center", marginTop: "2rem" }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (!patient) {
    return (
      <Container
        maxWidth="md"
        style={{ textAlign: "center", marginTop: "2rem" }}
      >
        <Typography variant="h5" color="error">
          Patient not found.
        </Typography>
      </Container>
    );
  }

  return (
    <>
      <AppBar position="static">
        <Navbar />
      </AppBar>
      <Container
        maxWidth="md"
        style={{ textAlign: "center", marginTop: "2rem" }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          style={{ width: "100%" }}
        >
          <Box
            style={{
              flex: 1, // Takes up 1/3 of the space
              maxWidth: "33%", // Ensure it doesn't exceed a third of the container's width
              padding: "1rem",
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ marginLeft: "2rem" }}>
              Patient Name: {patient.personal_details.first_name}{" "}
              {patient.personal_details.last_name}
            </Typography>

            {/* Table for structured display */}
            <Paper
              elevation={3}
              sx={{
                width: "50%",
                minWidth: "300px",
                padding: "1rem",
                marginLeft: "-150px",
              }}
            >
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <strong>DOB:</strong>
                    </TableCell>
                    <TableCell>
                      {patient.personal_details.date_of_birth}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Gender:</strong>
                    </TableCell>
                    <TableCell>{patient.personal_details.gender}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Diagnosis Date:</strong>
                    </TableCell>
                    <TableCell>
                      {patient.medical_profile.diagnosis_date}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Medications:</strong>
                    </TableCell>
                    <TableCell>
                      {patient.medical_profile.medications.length > 0
                        ? patient.medical_profile.medications.map(
                            (med, index) => (
                              <div key={index}>{med.medication_name}</div>
                            )
                          )
                        : "No medications listed"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </Box>
          <Box
            style={{
              flex: 2, // Right section 2/3
              maxWidth: "66%",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "80vh", // Same height as left section
            }}
          >
            {/* Top Section (inside the right section) */}
            <Box
              style={{
                flex: 1, // Takes up part of the vertical space
                marginBottom: "1rem",
                border: "1px solid #ccc",
                padding: "1rem",
              }}
            >
              current data
            </Box>

            {/* Bottom Section (inside the right section) */}
            <Box
              style={{
                flex: 1, // Takes up part of the vertical space
                border: "1px solid #ccc",
                padding: "1rem",
                display: "flex",
                flexDirection: "column", 
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TremorChart />
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default PatientPage;
