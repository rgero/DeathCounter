import { Container, Grid, Typography } from "@mui/material";

import DeathPieChart from "./DeathPieChart";
import { useDeathTracker } from "../../context/DeathTrackerContext";

const Stats = () => {
  const { deathList } = useDeathTracker();

  const sortedList = deathList.sort( (a,b) => b.deaths - a.deaths);
  const totalDeaths = deathList.reduce((total, currentItem) => total + currentItem.deaths, 0);
  const averagePerBoss = Math.round(totalDeaths / deathList.length * 100)/100;

  let percentage;
  if (sortedList.length > 0 && totalDeaths > 0)
  {
    percentage = Math.round((sortedList[0].deaths / totalDeaths) * 1000)/10
  }

  if (deathList.length == 0)
  {
    return;
  }

  return (
    <Container sx={{paddingTop: 5}}>
        <Grid container direction="column" spacing={4} alignItems="center" justifyContent="space-around">
          <Grid item>
          <Typography variant="h4" justifyContent="flex-start">Stats</Typography>
          </Grid>
          <Grid item>
            <Typography>Total Bosses: {deathList.length}</Typography>
            <Typography>Average Per Boss: {averagePerBoss}</Typography>
            <Typography>Most Deaths: {sortedList[0].name} - {sortedList[0].deaths} {percentage && `(${percentage}%)`}</Typography>
          </Grid>
          <Grid item>
            <DeathPieChart/>
          </Grid>
        </Grid>

    </Container>
  )
}

export default Stats
