import { Container, Grid, Typography } from '@mui/material';

import DeathEntity from './DeathEntity';
import DeathEntityForm from './DeathEntityForm';
import DeathPageHeader from './DeathPageHeader';
import React from 'react';
import { useLocalStorageState } from '../../hooks/useLocalStorage';

const DeathList = () => {
  const [deathList, setDeathList] = useLocalStorageState([])
  const [currentlySelected, setSelected] = React.useState({});

  const addToList = (newItem) => {
    if (newItem.id)
    {
      let index = deathList.findIndex(boss => boss.id === newItem.id);
      let newDeathList = deathList;
      newDeathList[index] = newItem;
      setDeathList( [...newDeathList]);
    } else {
      newItem.id = deathList.length + 1;
      setDeathList( (prev) => [...prev, newItem]);
    }
  }
  
  const clearItems = () => {
    setDeathList([])
  }

  const processCurrentlySelected = (item) => {
    setSelected(item);
  }

  return (
    <>
      <DeathPageHeader deaths={deathList} clear={clearItems}/>
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
