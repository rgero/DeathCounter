import { Container, Grid, Typography } from "@mui/material";

import DeathPieChart from "./DeathPieChart";
import { useDeathTracker } from "../../context/DeathTrackerContext";

const Stats = () => {
  const { deathList } = useDeathTracker();

  const sortedList = deathList.sort( (a,b) => b.deaths - a.deaths);
  const totalDeaths = deathList.reduce((total, currentItem) => total + currentItem.deaths, 0);
  const averagePerBoss = Math.round(totalDeaths / deathList.length * 100, 2)/100;

  if (deathList.length == 0)
  {
    return;
  }

  return (
    <Container sx={{paddingTop: 5}}>
        <Typography variant="h4">Stats</Typography>
        <Grid container direction="row" alignItems="center" justifyContent="space-around">
          <Grid item>
            <Typography>Average Per Boss: {averagePerBoss}</Typography>
            <Typography>Most Deaths: {sortedList[0].name} - {sortedList[0].deaths}</Typography>
          </Grid>
          <Grid item>
            <DeathPieChart/>
          </Grid>
        </Grid>

    </Container>
  )
}

export default Stats
