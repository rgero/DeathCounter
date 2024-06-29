import { Box, Grid, Typography } from '@mui/material';

import DeathEntity from './DeathEntity';
import DeathEntityForm from './DeathEntityForm';
import React from "react";

const DeathList = () => {
  const [deathList, setDeathList] = React.useState([]);

  const addToList = (name, deaths) => {
    const newItem = {name: name, deaths: deaths};
    setDeathList( (prev) => [...prev, newItem]);
  }
 
  return (
    <>
      <Typography>
        Total Deaths: {deathList.reduce((total, currentItem) => total + currentItem.deaths, 0)}
      </Typography>
      <Grid container direction="column" spacing={3}>
        <Grid container item direction="column" alignItems={"center"}>
        {
          deathList.map( (item, index) => (
            <Grid item key={index}>
              <DeathEntity>{item}</DeathEntity>
            </Grid>
          ))
        }
        </Grid>
        <Grid item>
          <DeathEntityForm submitFn={addToList}/>
        </Grid>
      </Grid>
    </>

  )
}

export default DeathList
