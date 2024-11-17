// src/pages/SignUpPage.js
import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Divider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Visibility, VisibilityOff } from "@mui/icons-material"; // Import icons

import CarouselSection from "../compontents/carousel";
import { registerUser } from "../services/api";
import theme from "../themes" // Import the theme

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility

  const validateForm = (data) => {
    const newErrors = {};
    if (!data.first_name) newErrors.first_name = "First name is required";
    if (!data.last_name) newErrors.last_name = "Last name is required";
    if (!data.username) newErrors.username = "Username is required";
    if (!data.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(data.email))
      newErrors.email = "Invalid email";
    if (!data.password) newErrors.password = "Password is required";
    else if (data.password.length < 6)
      newErrors.password = "Must be at least 6 characters";
    if (!data.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (data.password !== data.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    console.log("hello")
    if (Object.keys(validationErrors).length === 0) {
      try {
        await registerUser(formData);
        toast.success("Sign up successful!", { position: "top-right" });
        navigate("/login");
      } catch (error) {
        toast.error(error.message || "An error occurred. Please try again.", {
          position: "top-right",
        });
      }
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword); // Toggle password visibility
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword); // Toggle confirm password visibility
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        sx={{ width: "100vw", height: "100vh", bgcolor: "background.default" }}
      >
        <Grid item xs={12} md={6}>
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
              backgroundColor: "white",
              border: "5px solid",
              borderColor: "primary.main",
            }}
          >
            <Typography variant="h4" align="center" gutterBottom>
              Create an Account
            </Typography>
            <form onSubmit={handleSubmit}>
              <Typography
                variant="body1"
                color="textPrimary"
                sx={{ marginBottom: 1 }}
              >
                First Name
              </Typography>
              <TextField
                fullWidth
                placeholder="First Name"
                variant="outlined"
                margin="dense"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                error={Boolean(errors.first_name)}
                helperText={errors.first_name}
                sx={{
                  backgroundColor: theme.palette.secondary.main, // Using theme colo,
                  "& input:-webkit-autofill": {
                    WebkitBoxShadow: `0 0 0 1000px ${theme.palette.secondary.main} inset`, // Using theme colo
                  },
                }}
              />
              <Typography
                variant="body1"
                color="textPrimary"
                sx={{ marginBottom: 1 }}
              >
                Last Name
              </Typography>
              <TextField
                fullWidth
                placeholder="Last Name"
                variant="outlined"
                margin="dense"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                error={Boolean(errors.last_name)}
                helperText={errors.last_name}
                sx={{
                  backgroundColor: theme.palette.secondary.main, // Using theme colo,
                  "& input:-webkit-autofill": {
                    WebkitBoxShadow: `0 0 0 1000px ${theme.palette.secondary.main} inset`, // Using theme colo
                  },
                }}
              />
              <Typography
                variant="body1"
                color="textPrimary"
                sx={{ marginBottom: 1 }}
              >
                Username
              </Typography>
              <TextField
                fullWidth
                placeholder="Username"
                variant="outlined"
                margin="dense"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={Boolean(errors.username)}
                helperText={errors.username}
                sx={{
                  backgroundColor: theme.palette.secondary.main, // Using theme colo,
                  "& input:-webkit-autofill": {
                    WebkitBoxShadow: `0 0 0 1000px ${theme.palette.secondary.main} inset`, // Using theme colo
                  },
                }}
              />
              <Typography
                variant="body1"
                color="textPrimary"
                sx={{ marginBottom: 1 }}
              >
                Email
              </Typography>
              <TextField
                fullWidth
                placeholder="Email"
                variant="outlined"
                margin="dense"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={Boolean(errors.email)}
                helperText={errors.email}
                sx={{
                  backgroundColor: theme.palette.secondary.main, // Using theme colo,
                  "& input:-webkit-autofill": {
                    WebkitBoxShadow: `0 0 0 1000px ${theme.palette.secondary.main} inset`, // Using theme colo
                  },
                }}
              />
              <Typography
                variant="body1"
                color="textPrimary"
                sx={{ marginBottom: 1 }}
              >
                Password
              </Typography>
              <TextField
                fullWidth
                placeholder="Password"
                variant="outlined"
                margin="dense"
                name="password"
                type={showPassword ? "text" : "password"} // Toggle type
                value={formData.password}
                onChange={handleChange}
                error={Boolean(errors.password)}
                helperText={errors.password}
                sx={{
                  backgroundColor: theme.palette.secondary.main, // Using theme colo,
                  "& input:-webkit-autofill": {
                    WebkitBoxShadow: `0 0 0 1000px ${theme.palette.secondary.main} inset`, // Using theme colo
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Typography
                variant="body1"
                color="textPrimary"
                sx={{ marginBottom: 1 }}
              >
                Confirm Password
              </Typography>
              <TextField
                fullWidth
                placeholder="Confirm Password"
                variant="outlined"
                margin="dense"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"} // Toggle type
                value={formData.confirmPassword}
                onChange={handleChange}
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword}
                sx={{
                  backgroundColor: "#e9f9ed",
                  "& input:-webkit-autofill": {
                    WebkitBoxShadow: "0 0 0 1000px #e9f9ed inset",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{ marginTop: 2, backgroundColor: "primary.main" }}
              >
                Sign Up
              </Button>
              <Divider sx={{ margin: "20px 0" }} />
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={() => navigate("/login")}
              >
                Already have an account? Login
              </Button>
            </form>
          </Box>
        </Grid>
      </Grid>
      <ToastContainer />
    </ThemeProvider>
  );
};

export default SignUpPage;
