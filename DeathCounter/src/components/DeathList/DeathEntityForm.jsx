import { Add, Remove } from "@mui/icons-material";
import { Button, FormControl, FormHelperText, Grid, IconButton, Paper, TextField } from "@mui/material"

import React from "react"
import { isMobile } from "../../utils/isMobile";
import { useDeathTracker } from "../../context/DeathTrackerContext";
import {useSocket} from '../../hooks/useWebSocket';

const DeathEntityForm = () => {
  const socket = useSocket();
  const {addToList, currentlySelected} = useDeathTracker();
  const [id, setID] = React.useState(null);
  const [name, setName] = React.useState("");
  const [deaths, setDeaths] = React.useState(0);
  const [error, setError] = React.useState("");
  const [lastClick, setLastClick] = React.useState(new Date());
  const timeDelay = 500;

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
      setDeaths( (deaths) => deaths+1 );
    }
  }

  const processDecrement = () => {
    if (canProcess())
    {
      setDeaths( (deaths) => deaths-1 );
    }

  }

  React.useEffect( () => {
    socket.on("Death", processIncrement);
    socket.on("Submit", processSubmit);

    return () => {
      socket.off("Death", processIncrement);
      socket.off("Submit", processSubmit);
    }
  })

  React.useEffect( () => {
    if (!currentlySelected) { 
      if (id)
      {
        clearForm();
      }
      return;
    }

    setID(currentlySelected.id);
    setName(currentlySelected.name);
    setDeaths(currentlySelected.deaths);
    setError("");
  }, [currentlySelected])

  const clearForm = () => {
    setID(null)
    setName("");
    setDeaths(0);
    setError("");
  }

  const processSubmit = () => {
    if (name == "")
    {
      setError("Name must be filled out");
      return;
    }

    let itemToSubmit = {name: name, deaths: deaths};
    if (id != -1)
    {
      itemToSubmit.id = id;
    }
    addToList(itemToSubmit);
    clearForm();
  }

  const processNumber = (num) => {
    if( /^\d*$/.test(num) )
    {
      setDeaths(Number(num))
    }
  }

  return (
    <Paper sx={{padding: 2, borderRadius: 5, width: isMobile() ? "90%" : "500px", mx: "auto"}}>
      <FormControl fullWidth error={Boolean(error)}>
        <Grid container justifyContent="center" alignItems="center" spacing={3} direction={isMobile() ? "column" : "row"} sx={{paddingBottom: 2}}>
          <Grid item>
            <TextField 
              label="Name"
              value={name}
              error={error ? true : false}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Deaths"
              value={deaths}
              onChange={(e) => { processNumber(e.target.value) }}
            />
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
        <Button variant="outlined" onClick={processSubmit}>{id ? "Edit" : "Add"}</Button>
        <Grid container justifyContent={"center"} alignItems={"center"} paddingTop={2} >
          <Grid item>
            <FormHelperText>{error}</FormHelperText>
          </Grid>
        </Grid>
      </FormControl>
    </Paper>
  )
}

export default DeathEntityForm
