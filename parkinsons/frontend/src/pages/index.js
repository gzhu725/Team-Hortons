import React, { useState } from "react";
import { Container, AppBar, Box } from "@mui/material";
import Navbar from "../components/Navbar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Home = () => {
  const [date, setDate] = useState(new Date());

  const handleDateChange = (newDate) => {
    setDate(newDate);
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
            <Calendar
              onChange={handleDateChange}
              value={date}
              style={{
                width: "100%", // Fill width
                height: "100%", // Fill height
              }}
            />
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
              daily symptom how do u feel and typed notes
            </Box>

            {/* Bottom Section (inside the right section) */}
            <Box
              style={{
                flex: 1, // Takes up part of the vertical space
                border: "1px solid #ccc",
                padding: "1rem",
              }}
            >
              more data
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Home;
