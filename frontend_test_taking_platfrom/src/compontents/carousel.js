import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import Carousel1 from "../Images/home-banner__illust.svg";
import Carousel2 from "../Images/7402080.webp";
import Carousel3 from "../Images/7402077.webp";
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';

const CarouselSection = () => {
  return (
    <Grid
      item
      sx={{
        backgroundColor: "#e9f9ed",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 4,
        clipPath:
          "polygon(0 0, 80% 0%, 100% 100%, 85% 100%, 50% 100%, 15% 100%, 0 100%)",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 10,
          left: 10,
          display: "flex",
          alignItems: "center",
          color: "#004d4b",
          padding: "5px 10px",
          borderRadius: "10px",
        }}
      >
        <AssignmentTurnedInRoundedIcon sx={{ marginRight: 1, fontSize: "3.5rem" }} />
        <Typography variant="h6">Test Hub</Typography>
      </Box>

      <Carousel
        autoPlay
        interval={3000}
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        swipeable
      >
        <div>
          <img
            src={Carousel1}
            alt="Slide 1"
            style={{
              borderRadius: 10,
              width: "50%",
              height: "60%",
              objectFit: "cover",
            }}
          />
        </div>
        <div>
          <img
            src={Carousel2}
            alt="Slide 2"
            style={{
              borderRadius: 10,
              width: "60%",
              height: "auto",
              objectFit: "cover",
            }}
          />
        </div>
        <div>
          <img
            src={Carousel3}
            alt="Slide 3"
            style={{
              borderRadius: 10,
              width: "60%",
              height: "auto",
              objectFit: "cover",
            }}
          />
        </div>
      </Carousel>

      <Typography variant="h5" mt={5} color="primary" gutterBottom>
        Exam Mastery Hub
      </Typography>
      <Typography variant="body1" color="textSecondary" align="center" mb={3}>
        Unleash Your Academic Success with Exam Mastery Hub's Exam Excellence
        Platform
      </Typography>

      <Box sx={{ textAlign: "center", paddingX: 3 }}>
        <Typography variant="body1" color="textSecondary" paragraph>
          Welcome to <strong>Test Hub</strong>, your one-stop platform for comprehensive test preparation and practice. From interactive quizzes to timed practice exams, Test Hub is designed to boost your performance and help you achieve your academic and professional goals.
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Join thousands of students and professionals who trust Test Hub to improve their scores with tailored study plans, instant feedback, and performance tracking tools. Prepare for exams like never before with personalized learning experiences and adaptive question banks that evolve with your knowledge level.
        </Typography>
      </Box>
    </Grid>
  );
};

export default CarouselSection;
