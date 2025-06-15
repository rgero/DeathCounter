import { Container, Typography } from "@mui/material"

import GameSelector from "../components/game/GameSelector";
import Loading from "../components/ui/Loading";
import { useDeathLists } from "../context/DeathCounterContext";

const DashboardPage = () => {

  const {deathLists, isLoading, selectedGame, error} = useDeathLists();

  if (isLoading) {
    return <Loading/>
  }

  const selectedDeathList = deathLists.find((deathList) => {
    return deathList.id?.toString() === selectedGame;
  });

  return (
    <Container>
      <GameSelector/>
      <Typography variant="h4">User Authenicated</Typography>
      {selectedDeathList ? (
        <>
          <Typography variant="body1">
            {selectedDeathList.game.name}
          </Typography>
          <Typography>
            {selectedDeathList.entityList.map((entity) => entity.name).join(", ")}
          </Typography>
        </>
      ) : (
        <Typography>No game selected.</Typography>
      )}
    </Container>
  )
}

export default DashboardPage
