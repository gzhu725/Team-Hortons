//patient data page
import React from "react";
import { Container, Typography, AppBar } from "@mui/material";
import Navbar from "../components/Navbar";

const PatientPage = () => {
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
        patient data
        </Typography>
      </Container>
    </>
  );
};

export default PatientPage;
