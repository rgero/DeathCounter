import DeathEntity from './DeathEntity';
import DeathEntityForm from './DeathEntityForm';
import { Grid } from '@mui/material';
import React from "react";

const DeathList = () => {
  const [deathList, setDeathList] = React.useState([]);

  const addToList = (name, deaths) => {
    const newItem = {name: name, deaths: deaths};
    setDeathList( (prev) => [...prev, newItem]);
  }
  
  return (
    <Grid container direction="column">
      {
        deathList.map( (item, index) => (
          <Grid item key={index}>
            <DeathEntity>{item}</DeathEntity>
          </Grid>
        ))
      }
      <Grid>
        <DeathEntityForm submitFn={addToList}/>
      </Grid>
    </Grid>
  )
}

export default DeathList
