import { Container, Grid, Typography } from '@mui/material';

import DeathEntity from './DeathEntity';
import DeathEntityForm from './DeathEntityForm';
import DeathPageHeader from './DeathPageHeader';
import React from 'react';
import { useDeathTracker } from '../../context/DeathTrackerContext';

const DeathList = () => {
  const { deathList, addToList} = useDeathTracker();
  const [currentlySelected, setSelected] = React.useState({});

  const processCurrentlySelected = (item) => {
    setSelected(item);
  }

  return (
    <>
      <DeathPageHeader deaths={deathList}/>
      {deathList.length > 0 ? (
        <Container sx={{marginBottom: 5, width: 500}}>
            <Grid container justifyContent="center">
              <Grid container item direction="row" justifyContent="space-between">
                <Grid item>
                  <Typography variant="h5">Name</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h5">Deaths</Typography>
                </Grid>
              </Grid>
            {
              deathList.map( (item) => (
                <DeathEntity key={item.id} data={item} processClick={processCurrentlySelected} />
              ))
            }
            </Grid>
        </Container>
      ) : (null)}
      <Grid item>
        <DeathEntityForm data={currentlySelected} submitFn={addToList}/>
      </Grid>
    </>
  )
}

export default DeathList
