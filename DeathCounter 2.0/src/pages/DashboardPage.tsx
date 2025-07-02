import { Box, Container, Typography, useMediaQuery, useTheme } from "@mui/material"

import GameSelector from "../components/game/GameSelector";
import Loading from "../components/ui/Loading";
import { useDeathLists } from "../context/DeathCounterContext";

const DashboardPage = () => {
  const {deathLists, isLoading} = useDeathLists();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (isLoading) {
    return <Loading/>
  }

  const selectedDeathList = deathLists.find((deathList) => {
    return deathList.currentlyActive;
  });



  return (
    <Container>
      {isMobile ? <Box sx={{paddingBottom: "10px"}}><GameSelector/></Box> : null}
      {selectedDeathList ? (
        <>
          <Typography variant="body1">
            {selectedDeathList.name}
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
