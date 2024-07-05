import { Container, Typography } from "@mui/material";

import { useDeathTracker } from "../../context/DeathTrackerContext";

const Stats = () => {
  const { deathList } = useDeathTracker();

  const sortedList = deathList.sort( (a,b) => b.deaths - a.deaths);
  const totalDeaths = deathList.reduce((total, currentItem) => total + currentItem.deaths, 0);
  const averagePerBoss = Math.round(totalDeaths / deathList.length * 100, 2)/100;
  

  return (
    <Container sx={{paddingTop: 2}}>
      <Typography>Stats</Typography>
      <Typography>Average Per Boss: {averagePerBoss}</Typography>
      <Typography>Most Deaths: {sortedList[0].name} - {sortedList[0].deaths}</Typography>
    </Container>
  )
}

export default Stats
