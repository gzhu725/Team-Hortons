import React from "react";
import { Container, Typography, Button, AppBar, Toolbar } from "@mui/material";

const Home = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">My MUI React Page</Typography>
        </Toolbar>
      </AppBar>
      <Container
        maxWidth="md"
        style={{ textAlign: "center", marginTop: "2rem" }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome to My Page
        </Typography>
        <Typography variant="body1" paragraph>
          This is a simple React page using Material-UI components.
        </Typography>
        <Button variant="contained" color="primary">
          Click Me
        </Button>
      </Container>
    </>
  );
};

export default Home;
