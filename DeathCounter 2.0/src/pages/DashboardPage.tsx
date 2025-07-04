import { Box, Container, Typography, useMediaQuery, useTheme } from "@mui/material"

import DeathListTable from "../components/death_list/DeathListTable";
import DeathlistHeader from "../components/death_list/DeathlistHeader";
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
      {isMobile ? <Box sx={{paddingBottom: "20px"}}><GameSelector/></Box> : null}
      {selectedDeathList ? (
        <>
          <DeathlistHeader/>
          <DeathListTable/>
        </>
      ) : (
        <Typography>No game selected.</Typography>
      )}
    </Container>
  )
}

export default DashboardPage
