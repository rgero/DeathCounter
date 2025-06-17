import { Container, Typography } from "@mui/material"

import Loading from "../components/ui/Loading";
import { useDeathLists } from "../context/DeathCounterContext";

const DashboardPage = () => {

  const {deathLists, isLoading} = useDeathLists();

  if (isLoading) {
    return <Loading/>
  }

  const selectedDeathList = deathLists.find((deathList) => {
    return deathList.currentlyActive;
  });

  return (
    <Container>
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
