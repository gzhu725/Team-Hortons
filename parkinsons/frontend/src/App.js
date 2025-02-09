import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/index.js";
import DoctorPage from "./pages/doctor.js";
import PatientPage from "./pages/patient.js";
import { CssBaseline } from "@mui/material";
import LoginPage from "./pages/login.js"; 
import { AuthProvider, useAuth } from "./context/AuthContext";

const PrivateRoute = ({ element }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? element : <Navigate to="/login" />;
};


const theme = createTheme({
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
  palette: {
    background: {
      default: "#dce0dc",
    },
    text: {
      primary: "#333",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#9ecf97",
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: "#9ecf97",
        },
      },
    },
  },
});
function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route path="/" element={<PrivateRoute element={<Home />} />} />
            <Route path="/doctor/:doctorId" element={<PrivateRoute element={<DoctorPage />} />} />
            <Route path="/patient/:patientId" element={<PrivateRoute element={<PatientPage />} />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;