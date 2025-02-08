import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/index.js";
import { CssBaseline } from "@mui/material"; // Import CssBaseline

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  palette: {
    background: {
      default: "#ccffbf", // Set background color
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
          backgroundColor: "#ffcfe6", // Custom AppBar background color
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffcfe6", // Custom Toolbar background color
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Apply global styles */}
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
