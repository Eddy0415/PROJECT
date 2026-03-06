import React from "react";
import { useTheme } from "@mui/material/styles";
import { Button, Typography, Box } from "@mui/material";

const HeroSection = ({ onClick }) => {
  const theme = useTheme();

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundImage:
          "url('https://us.images.westend61.de/0001349832pw/a-man-with-ski-gear-and-mountains-and-water-behind-CAVF77790.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        }}
      ></div>
      <Box
        sx={{
          position: "absolute",
          top: { xs: "30%", sm: "40%" },
          left: { xs: "5%", sm: "10%", md: "4%" },
          transform: "translateY(-50%)",
          color: "white",
          textAlign: "left",
          zIndex: 3,
          width: { xs: "90%", sm: "80%", md: "60%" },
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
            textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)",
            marginBottom: "16px",
          }}
        >
          Skip the queue!
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: "2rem", sm: "2.25rem", md: "2.5rem" },
            marginBottom: "24px",
            textShadow: "1px 1px 3px rgba(0, 0, 0, 0.7)",
          }}
        >
          Be the first on the slopes and fully equipped
        </Typography>
        <Button
          onClick={onClick}
          variant="outlined"
          size="large"
          sx={{
            color: theme.palette.common.white,
            borderColor: theme.palette.common.white,
            "&:hover": {
              backgroundColor: theme.palette.common.white,
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
            },
            fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
            transition: "all 0.3s ease",
          }}
        >
          Rent Now
        </Button>
      </Box>

      <img
        src="/mountain.svg"
        alt="Mountain"
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "80%",
          marginBottom: "-190px",
          zIndex: 2,
        }}
      />
    </div>
  );
};

export default HeroSection;
