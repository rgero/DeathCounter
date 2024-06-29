import { Button, Grid, TextField, Typography } from "@mui/material"

import React from "react"
import {useSocket} from '../../hooks/useWebSocket';

const DeathEntityForm = ({submitFn}) => {
  const socket = useSocket();
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState("");
  const [deaths, setDeaths] = React.useState(0);

  const processIncrement = () => {
    setDeaths( (deaths) => deaths+1 );
  }

  React.useEffect( () => {
    socket.on("Death", processIncrement);

    return () => {
      socket.off("Death", processIncrement);
    }
  })

  const processSubmit = () => {
    if (name == "")
    {
      setError("Name must be filled out");
      return;
    }

    submitFn(name, deaths);
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
    <Grid container justifyContent={"center"} alignItems={"center"} spacing={3}>
      <Grid item>
        <TextField 
          label="Name"
          value={name}
          error={error ? true : false}
          helperText={error}
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
        <Button onClick={processSubmit}>Add</Button>
      </Grid>
    </Grid>
  )
}

export default DeathEntityForm
