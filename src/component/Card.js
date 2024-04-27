import React from "react";
import { Card as MyCard, CardContent, Typography, Box, Paper } from "@mui/material";

const Card = ({ head, desc }) => {
  return (
    <>
      {" "}
      {head === desc ? (
        <Paper  sx={{ marginBottom: 1 }}>
          <Typography
            variant="body2"
            component="div"
            textAlign={"center"}
            paddingY={1}
          >
            {head}
          </Typography>
        </Paper>
      ) : (
        <Box marginBottom={2}>
          <MyCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {head}
              </Typography>
              <Typography variant="body1">{desc}</Typography>
            </CardContent>
          </MyCard>{" "}
        </Box>
      )}
    </>
  );
};

export default Card;
