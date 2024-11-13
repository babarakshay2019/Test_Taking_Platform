// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#004d4b",
    },
    secondary: {
      main: "#e9f9ed",
    },
    background: {
      default: "#f0f9f7",
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
});

export default theme;
