import { Container, Grid, Typography } from "@mui/material";

import DeathPieChart from "./DeathPieChart";
import { isMobile } from "../../utils/isMobile";
import { useDeathTracker } from "../../context/DeathTrackerContext";

const Stats = () => {
  const { deathList } = useDeathTracker();
  const filteredList = deathList.filter(item => item.name !== "Generic Deaths");

  if (filteredList.length === 0) {
    return;
  }

  const sortedList = filteredList.sort( (a,b) => b.deaths - a.deaths)
  const totalDeaths = filteredList.reduce((total, currentItem) => total + currentItem.deaths, 0);
  const averagePerBoss = Math.round(totalDeaths / filteredList.length * 100)/100;

  let percentage;
  if (sortedList.length > 0 && totalDeaths > 0)
  {
    percentage = Math.round((sortedList[0].deaths / totalDeaths) * 1000)/10
  }

  if (filteredList.length == 0)
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
            <Typography>Total Bosses: {filteredList.length}</Typography>
            <Typography>Total Deaths: {totalDeaths}</Typography>
            <Typography>Average Per Boss: {averagePerBoss}</Typography>
            <Typography>Most Deaths: {sortedList[0].name} - {sortedList[0].deaths} {percentage && `(${percentage}%)`}</Typography>
          </Grid>
        </Grid>
        {!isMobile() && <DeathPieChart data={deathList}/>}
    </Container>
  )
}

export default Stats
