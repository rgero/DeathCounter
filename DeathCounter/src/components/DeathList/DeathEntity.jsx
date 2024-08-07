import { Grid, Typography } from "@mui/material"

import { useDeathTracker } from "../../context/DeathTrackerContext"

const styles = {
  gridItem: {
    '&:hover': {
      background: "#ac3232",
    },
    paddingX: 2
  }
}

const DeathEntity = ({data}) => {
  const {setCurrentlySelected} = useDeathTracker();

  const handleClick = (e) => {
    if (!data) { return; }
    setCurrentlySelected(data)
  }

  return (
    <>   
      <Grid item container direction="row" columnGap={5} onClick={handleClick} justifyContent="space-between" sx={styles.gridItem}>
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
    </>
  )
}

export default DeathEntity
