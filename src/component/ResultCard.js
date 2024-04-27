import React from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";

const MyCard = ({ onClick, title, description }) => {
  return (
    <Card
      sx={{
        cursor: "pointer",
        height: "150px",
        overflowY: "auto",
      }}
      onClick={onClick}
    >
      <CardContent>
        <Typography variant="h6" fontSize={"15px"} fontWeight={"bold"}>
          {title}
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: "9px", lineHeight: "1" }}
          component="p"
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const MyGrid = ({ data, setRes, res }) => {
  const handleClick = (id) => {
    setRes([...res, data[id]]);
  };

  return (
    <div style={{ flexGrow: 1, marginTop: 20 }}>
      <Grid container spacing={2}>
        {data.map((card, id) => (
          <Grid key={id} item xs={12} sm={6} md={4}>
            <MyCard
              onClick={() => handleClick(id)}
              title={card[0]}
              description={card[1]}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default MyGrid;
