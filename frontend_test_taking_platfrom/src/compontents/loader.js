import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const Loader = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      zIndex: 9999,
    }}
  >
    <CircularProgress color="primary" />
  </Box>
);

export default Loader;
