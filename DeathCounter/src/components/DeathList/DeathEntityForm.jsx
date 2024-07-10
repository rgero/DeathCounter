import { Button, FormControl, FormHelperText, Grid, TextField } from "@mui/material"

import React from "react"
import { useDeathTracker } from "../../context/DeathTrackerContext";
import {useSocket} from '../../hooks/useWebSocket';
import DeleteButton from "../Buttons/DeleteButton";

const DeathEntityForm = ({data={}}) => {
  const socket = useSocket();
  const {addToList} = useDeathTracker();
  const [id, setID] = React.useState(data.id ? data.id : null);
  const [name, setName] = React.useState(data.name ? data.name : "");
  const [deaths, setDeaths] = React.useState(data.deaths ? data.deaths : 0);
  const [error, setError] = React.useState(data.error ? data.error : "");

  const processIncrement = () => {
    setDeaths( (deaths) => deaths+1 );
  }

  React.useEffect( () => {
    socket.on("Death", processIncrement);

    return () => {
      socket.off("Death", processIncrement);
    }
  })

  React.useEffect( () => {
    setID(data.id ? data.id : null );
    setName(data.name ? data.name: "");
    setDeaths(data.deaths ? data.deaths : 0);
    setError("");
  }, [data])

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
    setID(null)
    setName("");
    setDeaths(0);
    setError("");
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
        <Grid item>
          {id ? (
            <DeleteButton target={ data }/>
          ) : (
            null
          )}
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
