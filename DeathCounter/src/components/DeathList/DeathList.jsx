import { Box, Container, Grid } from '@mui/material';

import DeathEntity from './DeathEntity';
import DeathEntityForm from './DeathEntityForm';
import DeathListHeader from './DeathListHeader';
import { useLocalStorageState } from '../../hooks/useLocalStorage';

const DeathList = () => {
  const [deathList, setDeathList] = useLocalStorageState([])

  const addToList = (name, deaths) => {
    const newItem = {id: deathList.length, name: name, deaths: deaths};
    setDeathList( (prev) => [...prev, newItem]);
  }
  
  const clearItems = () => {
    setDeathList([])
  }

  return (
    <>
      <DeathListHeader deaths={deathList} clear={clearItems}/>
      {deathList.length > 0 ? (
        <Container sx={{marginBottom: 5, width: 500}}>
            <Grid container justifyContent="center">
            {
              deathList.map( (item) => (
                <DeathEntity key={item.id} data={item} />
              ))
            }
            </Grid>
        </Container>
      ) : (null)}
      <Grid item>
        <DeathEntityForm submitFn={addToList}/>
      </Grid>
    </>
  )
}

export default DeathList
