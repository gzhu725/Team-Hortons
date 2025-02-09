import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const PatientBar = ({ firstName, lastName, isOk, onClick }) => {
  return (
    <AppBar
      position="static"
      color="default"
      sx={{ borderRadius: 2, boxShadow: 1, marginBottom: "16px" }}
      onClick={onClick}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <AccountCircleIcon sx={{ marginRight: "-400px" }} color="primary" />

        <Typography variant="h6" sx={{ flexGrow: 1, marginRight: "8px" }}>
          {lastName}, {firstName}
        </Typography>

        {isOk ? (
          <CheckCircleIcon color="success" />
        ) : (
          <ErrorIcon color="error" />
        )}
      </Toolbar>
    </AppBar>
  );
};

export default PatientBar;
