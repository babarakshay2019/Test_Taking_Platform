import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import CarouselSection from "../compontents/carousel";
import { loginUser } from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import theme from "../themes"; // Import the theme

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const data = await loginUser(formData);
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      toast.success("Login successful!", { position: "top-right" });
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.", { position: "top-right" });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container sx={{ width: "100vw", height: "100vh" }}>
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
              position: "relative",
              backgroundColor: "white",
              clipPath: "polygon(0 0, 100% 20px, 100% 100%, 0 100%)",
              border: "5px solid",
              borderColor: "primary.main",
            }}
          >
            <Typography variant="h4" color="textPrimary" align="center" gutterBottom>
              Log In
            </Typography>
            <form onSubmit={handleSubmit}>
              <Typography variant="body1" color="textPrimary" sx={{ marginBottom: 1 }}>
                Username
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                margin="dense"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
                sx={{
                  backgroundColor: theme.palette.secondary.main, // Using theme colo,
                  "& input:-webkit-autofill": {
                    WebkitBoxShadow: `0 0 0 1000px ${theme.palette.secondary.main} inset`, // Using theme colo
                  },
                }}
              />
              <Typography variant="body1" color="textPrimary" sx={{ marginTop: 2, marginBottom: 1 }}>
                Password
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                margin="dense"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: theme.palette.secondary.main, // Using theme colo,
                  "& input:-webkit-autofill": {
                    WebkitBoxShadow: `0 0 0 1000px ${theme.palette.secondary.main} inset`, // Using theme colo
                  },
                }}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="medium"
                sx={{ marginY: 2 }}
                type="submit"
              >
                Log In
              </Button>
            </form>
            <Divider sx={{ marginY: 2 }}>or</Divider>
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
      <ToastContainer />
    </ThemeProvider>
  );
};

export default LoginPage;
