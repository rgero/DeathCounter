import { Container, Typography } from "@mui/material"

import Loading from "../components/ui/Loading";
import { useDeathLists } from "../context/DeathCounterContext";

const DashboardPage = () => {

  const {deathLists, isLoading, error} = useDeathLists();

  if (isLoading) {
    return <Loading/>
  }

  return (
    <Container>
      <Typography variant="h4">User Authenicated</Typography>
      {deathLists.map((deathList) => (
        <>
          <Typography key={deathList.id} variant="body1">
            {deathList.game.name}
          </Typography>
          <Typography>
            {deathList.entityList.map(entity => entity.name).join(", ")}
          </Typography>
        </>
      ))}
    </Container>
  )
}

export default DashboardPage
