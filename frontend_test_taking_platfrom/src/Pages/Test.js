import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { getAllTest } from '../services/api';
import Loader from '../compontents/loader'; // Import the Loader component

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

const StartTest = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state for universal loader

  const fetchTests = async (currentPage) => {
    try {
      setIsFetching(true);
      setIsLoading(true);
      const response = await getAllTest(currentPage);
      setTests((prevTests) => [...prevTests, ...(Array.isArray(response?.results) ? response.results : [])]);
      if (response?.maxPage) {
        setMaxPage(response.maxPage);
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
      setIsFetching(false);
      setIsLoading(false); // Hide the loader
    }
  };

  useEffect(() => {
    fetchTests(page);
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50 && !isFetching && page < maxPage) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFetching, page, maxPage]);

  const handleTestAction = (id, status) => {
    navigate(`/view-test/${id}`, { state:  "startTest" });
  };
  
  

  return (
    <ThemeProvider theme={theme}>
      {isLoading && <Loader />} {/* Show the loader when isLoading is true */}
      <Box sx={{ padding: '16px', borderRadius: '12px' }}>
        <Typography variant="h5" sx={{ mb: 2, textAlign: 'center', color: '#004d4b', fontWeight: 'bold' }}>
          Test History
        </Typography>

        {loading ? (
          <Typography sx={{ textAlign: 'center', color: '#004d4b' }}>Loading tests...</Typography>
        ) : (
          <>
            <Grid container spacing={3}>
              {tests.map((test) => (
                <Grid item xs={12} sm={6} key={test.id} mt={5}>
                  <Card
                    sx={{
                      padding: '16px',
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      boxShadow: 3,
                      width: '85%',
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" sx={{ color: '#004d4b', fontWeight: 'bold' }}>
                        {test.title}
                      </Typography>
                      <Typography sx={{ color: '#004d4b', marginBottom: '16px' }}>
                        {test.description}
                      </Typography>

                      <Box sx={{ textAlign: 'right' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleTestAction(test.id)}
                          sx={{ width: '120px' }}
                        >
                          Start Test
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {isFetching && <Typography sx={{ textAlign: 'center', color: '#004d4b' }}>Loading more tests...</Typography>}
          </>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default StartTest;
