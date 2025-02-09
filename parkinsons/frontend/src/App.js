import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/index.js";
import DoctorPage from "./pages/doctor.js"
import PatientPage from "./pages/patient.js"
import { CssBaseline } from "@mui/material"; 

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  palette: {
    background: {
      default: "#dce0dc", // Set background color
    },
    text: {
      primary: "#333", // Set text color (optional)
    },
  },  
  components: {
    // Override AppBar and Toolbar styles
    MuiAppBar: {
      styleOverrides: {
        root: {
         backgroundColor: "#9ecf97", // Custom AppBar background color
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: "#9ecf97", // Custom Toolbar background color
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctor" element={<DoctorPage />} />
        <Route path="/patient/:patientId" element={<PatientPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
