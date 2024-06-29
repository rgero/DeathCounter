import { Container, Grid } from '@mui/material';

import DeathEntity from './DeathEntity';
import DeathEntityForm from './DeathEntityForm';
import DeathListHeader from './DeathListHeader';
import { useLocalStorageState } from '../../hooks/useLocalStorage';

const DeathList = () => {
  const [deathList, setDeathList] = useLocalStorageState([])

  const addToList = (name, deaths) => {
    const newItem = {name: name, deaths: deaths};
    setDeathList( (prev) => [...prev, newItem]);
  }
  
  const clearItems = () => {
    setDeathList([])
  }

  return (
    <>
      <DeathListHeader deaths={deathList} clear={clearItems}/>
      {deathList.length > 0 ? (
        <Container sx={{marginBottom: 5}}>
            {
              deathList.map( (item, index) => (
                <DeathEntity key={index}>{item}</DeathEntity>
              ))
            }
        </Container>
      ) : (null)}
      <Grid item>
        <DeathEntityForm submitFn={addToList}/>
      </Grid>
    </>
  )
}

export default DeathList
