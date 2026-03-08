import { Container, Divider, Typography } from "@mui/material"

import { useStatsProvider } from '@context/stats/StatsContext';

const StatsPage = () => {
  const { totalDeaths, totalEntities, averageDeaths } = useStatsProvider();
  return (
    <Container>
      <Typography variant="h4">Stats Page</Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body1">This page is under construction.</Typography>
      <Typography variant="body1">Total Deaths: {totalDeaths}</Typography>
      <Typography variant="body1">Total Entities: {totalEntities}</Typography>
      <Typography variant="body1">Average Deaths: {averageDeaths}</Typography>
    </Container>
  )
}

export default StatsPage
