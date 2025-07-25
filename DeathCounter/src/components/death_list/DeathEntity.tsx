import { Grid, Typography, useTheme } from "@mui/material"

import { Entity } from "../../interfaces/Entity";
import { useDeathLists } from "../../context/DeathCounterContext";

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
      <Grid>
        <Typography>
          {data.name}
        </Typography>
      </Grid>
      <Grid>
        <Typography>
          {data.deaths}
        </Typography>
      </Grid>
    </Grid>
  )
}

export default DeathEntity
