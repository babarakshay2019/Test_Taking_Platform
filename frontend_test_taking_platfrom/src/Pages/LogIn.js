import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import CarouselSection from '../compontents/carousel'; // Import the CarouselSection component

const theme = createTheme({
  palette: {
    primary: {
      main: "#004d4b",
    },
    secondary: {
      main: "#e9f9ed",
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
});

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // Function to validate the form fields
  const validateForm = (data) => {
    const newErrors = {};
    if (!data.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(data.email)) newErrors.email = "Email is invalid";
    if (!data.password) newErrors.password = "Password is required";
    else if (data.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Reset the error messages for that field when the user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      // Form is valid, submit data here
      console.log("Form submitted", formData);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <style>
        {`
          .carousel .control-dots .dot {
            width: 12px;
            height: 12px;
            background-color: #004d4b;
            border-radius: 50%;
            margin: 0 5px;
            opacity: 0.6;
            transition: opacity 0.3s ease;
          }
          .carousel .control-dots .dot.selected {
            opacity: 1;
            background-color: #004d4b;
          }
          .carousel .control-dots {
            bottom: 10px;
          }
        `}
      </style>

      <Grid container sx={{ width: "100vw", height: "100vh" }}>
        <Grid
          item
          xs={12}
          md={6}
        >
          <CarouselSection />
        </Grid>

        <Grid
          item
          xs={12}
          md={5}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "80%",
              maxWidth: "400px",
              padding: 3,
              position: "relative",
              backgroundColor: "white",
              clipPath: "polygon(0 0, 100% 20px, 100% 100%, 0 100%)",
              border: "5px solid",
              borderColor: "primary.main",
            }}
          >
            <Typography
              variant="h4"
              color="textPrimary"
              align="center"
              gutterBottom
            >
              Log In
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="dense"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={Boolean(errors.email)}
                helperText={errors.email}
              />
              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                margin="dense"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={Boolean(errors.password)}
                helperText={errors.password}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="medium"
                sx={{ marginY: 1 }}
                type="submit"
                disabled={Object.keys(errors).length > 0 || !formData.email || !formData.password}
              >
                Log In
              </Button>
            </form>
            <Divider sx={{ marginY: 1 }}>or</Divider>
            <Typography variant="body2" align="center" color="textSecondary">
              Don't have an account?{" "}
              <a
                href="/"
                style={{ textDecoration: "none", color: "#004d4b" }}
              >
                Sign up
              </a>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default LoginPage;
