import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Tabs,
  Tab,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import HistoryIcon from "@mui/icons-material/History";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Leaderboard from "../Pages/LeaderBoard";
import TestHistory from "../Pages/TestHistroy";
import Test from "../Pages/Test";
import { logoutUser } from "../services/api";

// Define the custom theme inside the component
const theme = createTheme({
  palette: {
    primary: {
      main: "#004d4b", // Dark teal color
    },
    secondary: {
      main: "#e9f9ed", // Light green color
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
});

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleLogout = async (e) => {
    navigate('/login')
    try {
      // If you are logging in, make sure to use the correct function like loginUser
      const data = await logoutUser(); // Or change to loginUser if needed

      localStorage.clear();
      navigate('/login')
    } catch (error) {
      console.log("Logout Fail");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        {/* Top Bar (Sticky) */}
        <AppBar
          position="fixed"
          color="secondary"
          sx={{ width: "100%", zIndex: 1201 }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            {/* Left Icon (Test Hub) */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <DashboardIcon
                sx={{ marginRight: 1, color: theme.palette.primary.main }}
              />
              <Typography variant="h6" color="primary">
                Test Hub
              </Typography>
            </Box>

            {/* Right Icon (Logout) */}
            <IconButton color="primary" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Main Content Area */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            marginTop: "64px",
          }}
        >
          {/* Tabs Section */}
          <Box sx={{ width: "100%", p: 2 }}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              centered
              TabIndicatorProps={{
                style: { backgroundColor: theme.palette.primary.main },
              }}
              textColor="primary"
            >
              <Tab icon={<LeaderboardIcon />} label="Leaderboard" />
              <Tab icon={<HistoryIcon />} label="Test History" />
              <Tab icon={<AddBoxIcon />} label="New Test" />
            </Tabs>

            {/* Render Components Based on Selected Tab */}
            <Box sx={{ mt: 2 }}>
              {selectedTab === 0 && <Leaderboard />}
              {selectedTab === 1 && <TestHistory />}
              {selectedTab === 2 && <Test />}
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
