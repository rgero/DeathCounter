import { Grid, Typography, useTheme } from "@mui/material"

import { Entity } from '@interfaces/Entity';
import { useDeathLists } from '@context/deathCounter/DeathCounterContext';

const DeathEntity = ({index, data} : {index: number, data: Entity}) => {
  const {setEntityInEdit} = useDeathLists();
  const theme = useTheme();
  const styles = {
    gridItem: {
      paddingX: 1,
      backgroundColor: index % 2 === 0 ? "" : theme.palette.grey[800]
    }
  }

  return (
    <Grid container direction="row" justifyContent="space-between" sx={styles.gridItem} onClick={() => { setEntityInEdit(data) } }>
      <Grid size={10}>
        <Typography>
          {data.name}
        </Typography>
      </Grid>
      <Grid size={2}>
        <Typography align="right">
          {data.deaths}
        </Typography>
      </Grid>
    </Grid>
  )
}

export default DeathEntity
