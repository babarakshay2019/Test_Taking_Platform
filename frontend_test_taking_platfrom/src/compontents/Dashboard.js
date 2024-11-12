import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Tabs,
  Tab,
  IconButton,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import HistoryIcon from '@mui/icons-material/History';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Leaderboard from '../Pages/LeaderBoard';
import TestHistory from '../Pages/TestHistroy';
import Test from '../Pages/Test';

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
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Top Bar (Sticky) */}
        <AppBar position="fixed" color="secondary" sx={{ width: '100%', zIndex: 1201 }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* Left Icon (Test Hub) */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <DashboardIcon sx={{ marginRight: 1, color: theme.palette.primary.main }} />
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
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, marginTop: '64px' }}>
          {/* Tabs Section */}
          <Box sx={{ width: '100%', p: 2 }}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              centered
              TabIndicatorProps={{ style: { backgroundColor: theme.palette.primary.main } }}
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
