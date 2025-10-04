import { Box, Grid, Typography } from "@mui/material"

import { grey } from "@mui/material/colors"
import { useDeathLists } from "../../context/deathCounter/DeathCounterContext";

const GameStats = () => {
  const {activeDeathList} = useDeathLists();
  return (
    <Box sx={{backgroundColor: `${grey[800]}`, padding: "10px", borderRadius: 3}}>
      <Typography variant="h5" color="textSecondary">Stats</Typography>
      <Grid container sx={{marginTop: "10px"}} direction="column">
        <Grid><Typography>Total Bosses: {activeDeathList?.entityList.length || 0}</Typography></Grid>
        <Grid><Typography>Total Deaths: {activeDeathList?.entityList.reduce((acc, entity) => acc + (entity.deaths || 0), 0) || 0}</Typography></Grid>
      </Grid>
    </Box>
  )
}

export default GameStats
