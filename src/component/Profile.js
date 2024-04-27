import React from "react";
import { Avatar, Typography, Grid } from "@mui/material";

const UserProfile = ({ name, profilePic }) => {
  return (
    <Grid container alignItems="center" spacing={1}>
      <Grid item >
        <Avatar
          alt={name}
          src={profilePic}
          sx={{ width: "24px", height: "24px" }}
        />
      </Grid>
      <Grid item>
        <Typography sx={{ fontWeight: "bold" }}>{name}</Typography>
      </Grid>
    </Grid>
  );
};

export default UserProfile;
