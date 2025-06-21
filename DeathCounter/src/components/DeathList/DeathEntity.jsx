import { Grid, Typography, useTheme } from "@mui/material"

import { useDeathTracker } from "../../context/DeathTrackerContext"

const DeathEntity = ({index, data}) => {
  const {setCurrentlySelected} = useDeathTracker();
  const theme = useTheme();

  const handleClick = (e) => {
    if (!data) { return; }
    setCurrentlySelected(data)
  }

  const styles = {
    gridItem: {
      paddingX: 1,
      backgroundColor: index % 2 === 0 ? "" : theme.palette.grey[800]
    }
  }

  return (
    <Grid item container direction="row" onClick={handleClick} justifyContent="space-between" sx={styles.gridItem}>
      <Grid item>
        <Typography>
          {data.name}
        </Typography>
      </Grid>
      <Grid item>
        <Typography>
          {data.deaths}
        </Typography>
      </Grid>
    </Grid>
  )
}

export default DeathEntity
