import { Container, Grid, Typography } from '@mui/material';

import DeathEntity from './DeathEntity';
import DeathEntityForm from './DeathEntityForm';
import DeathListHeader from './DeathListHeader';
import DeathPageHeader from './DeathPageHeader';
import React from 'react';
import { useDeathTracker } from '../../context/DeathTrackerContext';

const DeathList = () => {
  const { deathList} = useDeathTracker();
  const [currentlySelected, setSelected] = React.useState({});
  
  const processCurrentlySelected = (item) => {
    setSelected(item);
  }

  return (
    <>
      <DeathPageHeader deaths={deathList}/>
      {deathList.sort((a,b) => a.id - b.id).length > 0 ? (
        <Container sx={{marginBottom: 5, width: 500}}>
            <Grid container justifyContent="center">
            <DeathListHeader/>
            {
              deathList.map( (item) => (
                <DeathEntity key={item.id} data={item} processClick={processCurrentlySelected} />
              ))
            }
            </Grid>
        </Container>
      ) : (null)}
      <Grid item>
        <DeathEntityForm data={currentlySelected}/>
      </Grid>
    </>
  )
}

export default DeathList
