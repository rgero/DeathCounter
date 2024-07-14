import { Container, Grid } from '@mui/material';
import React, { useEffect } from 'react';

import DeathEntity from './DeathEntity';
import DeathEntityForm from './DeathEntityForm';
import DeathListHeader from './DeathListHeader';
import DeathPageHeader from './DeathPageHeader';
import { useDeathTracker } from '../../context/DeathTrackerContext';
import { useSearchParams } from 'react-router-dom';

const DeathList = () => {
  const { deathList, filterList } = useDeathTracker();
  const [filteredList, setFilteredList] = React.useState( filterList() );
  const [currentlySelected, setSelected] = React.useState({});
  const [searchParams] = useSearchParams();

  useEffect( () => {
    setFilteredList( filterList(searchParams.get('filter')) );
  }, [deathList, searchParams])

  
  const processCurrentlySelected = (item) => {
    setSelected(item);
  }

  return (
    <>
      <DeathPageHeader deaths={deathList}/>
      {filteredList.sort((a,b) => a.id - b.id).length > 0 ? (
        <Container sx={{marginBottom: 5, width: 500}}>
            <Grid container justifyContent="center">
            <DeathListHeader/>
            {
              filteredList.map( (item) => (
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
