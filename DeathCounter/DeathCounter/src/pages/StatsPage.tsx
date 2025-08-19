import { Container, Divider, Typography } from "@mui/material"

import { useStatsProvider } from "../context/stats/StatsContext";

const StatsPage = () => {
  const { deathCount, bossCount, gameCount } = useStatsProvider();
  return (
    <Container>
      <Typography variant="h4">Stats Page</Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body1">This page is under construction.</Typography>
      <Typography variant="body1">Total Deaths: {deathCount}</Typography>
      <Typography variant="body1">Total Bosses: {bossCount}</Typography>
      <Typography variant="body1">Total Games: {gameCount}</Typography>
    </Container>
  )
}

export default StatsPage
