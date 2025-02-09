import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "false"
  );

  const [isPatient, setIsPatient] = useState(
    localStorage.getItem("isPatient") === "true"
  );

  const [user, setUser] = useState(
    localStorage.getItem("user") === "null"
  )

  const login = (patient) => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");

    setIsPatient(patient);
    localStorage.setItem("isPatient", patient ? "true" : "false");
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsPatient(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isPatient");
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, isPatient, login, logout, setIsPatient, user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
