import { Container, Paper } from '@mui/material';
import React, { useEffect } from 'react';

import DeathEntity from './DeathEntity';
import DeathEntityForm from './DeathEntityForm';
import DeathListHeader from './DeathListHeader';
import DeathPageHeader from './DeathPageHeader';
import { isMobile } from '../../utils/isMobile';
import { useDeathTracker } from '../../context/DeathTrackerContext';
import { useSearchParams } from 'react-router-dom';
import { useSocket } from '../../hooks/useWebSocket';

const DeathList = () => {
  const { deathList, filterList, incrementGenericDeath } = useDeathTracker();
  const [filteredList, setFilteredList] = React.useState( filterList() );
  const [currentlySelected, setSelected] = React.useState({});
  const [searchParams] = useSearchParams();
  const socket = useSocket();

  useEffect( () => {
    setFilteredList( filterList(searchParams.get('filter')) );

    socket.on("Generic Death", processGenericDeath);

    return () => {
      socket.off("Generic Death", processGenericDeath);
    }

  }, [deathList, searchParams])

  
  const processCurrentlySelected = (item) => {
    setSelected(item);
  }

  const processGenericDeath = () => {
    incrementGenericDeath();
  }

  return (
    <Container>
      <DeathPageHeader deaths={deathList}/>
      {filteredList.sort((a,b) => a.id - b.id).length > 0 ? (
        <Paper sx={
          {
            mb: 5,
            p: 2,
            mt: 2,
            borderRadius: 5,
            width: isMobile() ? "90%" : "500px",
            mx: "auto"
          }
        }>
          <DeathListHeader/>
          {
            filteredList.map( (item) => (
              <DeathEntity key={item.id} data={item} processClick={processCurrentlySelected} />
            ))
          }
        </Paper>
      ) : (null)}
      <DeathEntityForm data={currentlySelected}/>
    </Container>
  )
}

export default DeathList
