import React, { useState, useEffect } from "react";
import { Container, Typography, AppBar } from "@mui/material";
import Navbar from "../components/Navbar";
import PatientBar from "../components/PatientBar";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const AccountPage = () => {
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState(null); // Start as null
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

};

export default AccountPage;
