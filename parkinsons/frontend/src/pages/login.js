import React, { createContext, useContext, useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import Home from "./index.js";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { isLoggedIn, setIsLoggedIn, login, logout, isPatient, setIsPatient, user, setUser } =
    useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (email && password) {
      try {
        // Fetch doctor and patient data
        const doctorDataResponse = await fetch("/doctordata.json");
        const patientDataResponse = await fetch("/patientdata.json");

        const doctorData = await doctorDataResponse.json();
        const patientData = await patientDataResponse.json();
        //console.log(doctorData)


        // Check for a matching email and password in the doctor data
        const doctor = doctorData.find(
          (item) => item.email === email && item.password === password
        );
        // Check for a matching email and password in the patient data
        const patient = patientData.find(
          (item) => item.email === email && item.password === password
        );

        // If a match is found in doctor data
        if (doctor) {
          setUser(doctor)
          console.log(doctor)
          setIsLoggedIn(true);
          setIsPatient(false); // Doctor is not a patient
          navigate(`/doctor/${doctor.user_id}`);
          return;
        }

        // If a match is found in patient data
        if (patient) {
          setUser(patient)
          setIsLoggedIn(true);
          setIsPatient(true); // Patient is logged in
          navigate("/");
          return;
        }
        else {
          alert("Wrong email or password.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("An error occurred while logging in.");
      }
    } else {
      alert("Please enter both email and password.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={5}>
        <Typography variant="h4" gutterBottom>
          {isLoggedIn ? "Welcome!" : "Login"}
        </Typography>
        {isLoggedIn ? (
          <Home />
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleLogin}>
              Login
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default LoginPage;
