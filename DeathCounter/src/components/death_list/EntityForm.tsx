import { Add, Remove } from "@mui/icons-material";
import { Button, FormControl, FormHelperText, Grid, IconButton, Paper, TextField, useMediaQuery, useTheme } from "@mui/material"
import React, { useEffect } from "react"

import { Entity } from "../../interfaces/Entity";
import { useDeathLists } from "../../context/DeathCounterContext";

const EntityForm = () => {
  const {addToList, entityInEdit, setEntityInEdit, removeEntityFromList} = useDeathLists();
  const [id, setID] = React.useState<number>(-1);
  const [name, setName] = React.useState("");
  const [deaths, setDeaths] = React.useState(0);
  const [error, setError] = React.useState("");
  const [lastClick, setLastClick] = React.useState(new Date());
  const timeDelay: number = 500;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (entityInEdit)
    {
      setID(entityInEdit.id ?? -1);
      setName(entityInEdit.name);
      setDeaths(entityInEdit.deaths);
    }
    else
    {
      clearForm();
    }
  },[entityInEdit]);

  const canProcess = () => {
    const now = new Date();
    if ((now.getTime() - lastClick.getTime()) > timeDelay)
    {
      setLastClick(now);
      return true;
    }
  }

  const processIncrement = () => {
    if (canProcess())
    {
      const entityInEdit: Entity = {id: id, name: name, deaths: deaths+1};
      setEntityInEdit(entityInEdit);
    }
  }

  const processDecrement = () => {
    if (canProcess())
    {
      const entityInEdit: Entity = {id: id, name: name, deaths: deaths-1};
      if (entityInEdit.deaths < 0)
      {
        setError("Deaths cannot be negative");
        return;
      }
      setEntityInEdit(entityInEdit);
    }
  }

  const clearForm = () => {
    setEntityInEdit(null);
    setID(-1)
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

    const itemToSubmit: Entity = {name: name, deaths: deaths};
    if (id != -1)
    {
      itemToSubmit.id = id;
    }
    addToList(itemToSubmit);
    clearForm();
  }

  const processNumber = (num: string) => {
    if( /^\d*$/.test(num) )
    {
      setDeaths(Number(num))
    }
  }

  const removeEntity = () => {
    if (id == -1) {
      setError("No entity selected to remove");
      return;
    }
    removeEntityFromList(id);
    clearForm();
  }

  return (
    <Paper sx={{marginTop: 2, padding: 2, borderRadius: 5, width: isMobile ? "90%" : "500px", mx: "auto"}}>
      <FormControl fullWidth error={Boolean(error)}>
        <Grid container justifyContent="center" alignItems="center" spacing={3} direction={isMobile ? "column" : "row"} sx={{paddingBottom: 2}}>
          <Grid>
            <TextField 
              label="Name"
              value={name}
              error={error ? true : false}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </Grid>
          <Grid>
            <TextField
              label="Deaths"
              value={deaths}
              onChange={(e) => { processNumber(e.target.value) }}
            />
          </Grid>
        </Grid>
        <Grid container justifyContent="space-around" alignItems="center" paddingBottom={2}>
          <Grid>
            <IconButton color="error" onClick={processDecrement}><Remove/></IconButton>
          </Grid>
          <Grid>
            <IconButton color="success" onClick={processIncrement}><Add/></IconButton>
          </Grid>
        </Grid>
        <Grid container justifyContent="flex-end" alignItems="center" spacing={2}>
          { id != -1 ? (
            <Grid>
              <Button variant="outlined" onClick={removeEntity}>Delete</Button>
            </Grid>
          ): (null)}
          <Grid>
            <Button variant="outlined" onClick={processSubmit}>{id != -1 ? "Edit" : "Add"}</Button>
          </Grid>
        </Grid>
        <Grid container justifyContent={"center"} alignItems={"center"} paddingTop={2} >
          <Grid>
            <FormHelperText>{error}</FormHelperText>
          </Grid>
        </Grid>
      </FormControl>
    </Paper>
  )
}

export default EntityForm
