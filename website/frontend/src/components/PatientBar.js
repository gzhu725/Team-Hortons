import React from "react";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const PatientBar = ({ firstName, lastName, isOk, onClick }) => {
  return (
    <AppBar
      position="static"
      color="default"
      sx={{
        borderRadius: 2,
        boxShadow: 1,
        marginBottom: "16px",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.05)", // Slightly enlarges the bar on hover
        },
        cursor: "pointer", // Changes cursor to indicate interactivity
      }}
      onClick={onClick}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <AccountCircleIcon sx={{ marginRight: "-400px" }} color="primary" />

        <Typography variant="h6" sx={{ flexGrow: 1, marginRight: "8px" }}>
          {lastName}, {firstName}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            paddingRight: 2,
          }}
        >
          <Typography>Status:</Typography>
          {isOk ? (
            <Box
              sx={{
                backgroundColor: "green",
                width: 100,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            ></Box>
          ) : (
            <Box
              sx={{
                backgroundColor: "red",
                width: 100,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            ></Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default PatientBar;
