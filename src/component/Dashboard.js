import { Box, Typography } from "@mui/material";
import React from "react";
import { assets } from "../assets/assets.js";
const Dashboard = () => {
  return (
    <Box
      sx={{
        backgroundColor: "	#e3f1be",
        borderRadius: "5px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 2,
        border: "1px solid #5e5e5e5e",
      }}
    >
      <Box>
        <Typography
          sx={{
            fontSize: "26px",
            color: "white",
            marginBottom: 2,
          }}
        >
          Hello, Osama!
        </Typography>
        <Typography variant="body" fontSize={"16px"}>
          How Can I Help you tody?
        </Typography>
      </Box>
      <img src={assets.icons} />
    </Box>
  );
};

export default Dashboard;
