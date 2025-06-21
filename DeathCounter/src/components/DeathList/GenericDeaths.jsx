import { Add, Remove } from "@mui/icons-material";
import { Grid, IconButton, Paper, Typography } from "@mui/material";

import React from "react";
import { isMobile } from "../../utils/isMobile";
import { useDeathTracker } from "../../context/DeathTrackerContext";
import { useSocket } from "../../hooks/useWebSocket";

const GenericDeaths = () => {
  const {genericDeaths, decrementGenericDeath, incrementGenericDeath} = useDeathTracker();
  const [lastClick, setLastClick] = React.useState(new Date());
  const timeDelay = 500;
  const socket = useSocket();

  React.useEffect( () => {
    socket.on("Generic Death", processIncrement);

    return () => {
      socket.off("Generic Death", processIncrement);
    }
  })

  const canProcess = () => {
    const now = new Date();
    if ((now - lastClick) > timeDelay)
    {
      setLastClick(now);
      return true;
    }
  }

  const processIncrement = () => {
    if (canProcess())
    {
      incrementGenericDeath();
    }
  }

  const processDecrement = () => {
    if (canProcess())
    {
      decrementGenericDeath();
    }
  }

  return (
    <Paper sx={{padding: 2, borderRadius: 5, width: isMobile() ? "90%" : "500px", mx: "auto"}}>
      <Grid container justifyContent="center" alignItems="center" spacing={3} direction={isMobile() ? "column" : "row"} sx={{paddingBottom: 2}}>
        <Grid item>
          <Typography variant="h5" align="center">
            Generic Deaths
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h5" align="center">
            {genericDeaths}
          </Typography>
        </Grid>
      </Grid>
      <Grid container justifyContent="space-around" alignItems="center" paddingBottom={2}>
        <Grid item>
          <IconButton color="error" onClick={processDecrement}><Remove/></IconButton>
        </Grid>
        <Grid item>
          <IconButton color="success" onClick={processIncrement}><Add/></IconButton>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default GenericDeaths
