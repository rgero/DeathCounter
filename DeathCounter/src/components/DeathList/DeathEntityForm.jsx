import { Button, FormControl, FormHelperText, Grid, TextField } from "@mui/material"

import React from "react"
import { useDeathTracker } from "../../context/DeathTrackerContext";
import {useSocket} from '../../hooks/useWebSocket';

const DeathEntityForm = () => {
  const socket = useSocket();
  const {addToList, currentlySelected} = useDeathTracker();
  const [id, setID] = React.useState(null);
  const [name, setName] = React.useState("");
  const [deaths, setDeaths] = React.useState(0);
  const [error, setError] = React.useState("");

  const processIncrement = () => {
    setDeaths( (deaths) => deaths+1 );
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
    <FormControl fullWidth error={Boolean(error)}>
      <Grid container justifyContent={"center"} alignItems={"center"} spacing={3}>
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
        <Grid item sm={1.5}>
          <TextField
            label="Deaths"
            value={deaths}
            onChange={(e) => { processNumber(e.target.value) }}
          />
        </Grid>
        <Grid item>
          <Button onClick={processSubmit}>{id ? "Edit" : "Add"}</Button>
        </Grid>
      </Grid>
      <Grid container justifyContent={"center"} alignItems={"center"} paddingTop={2} >
        <Grid item>
          <FormHelperText>{error}</FormHelperText>
        </Grid>
      </Grid>
    </FormControl>
  )
}

export default DeathEntityForm
