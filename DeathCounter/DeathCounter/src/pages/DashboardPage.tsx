import { Box, Container } from "@mui/material"

import DeathListTable from "../components/death_list/DeathListTable";
import DeathlistHeader from "../components/death_list/DeathlistHeader";
import EntityForm from "../components/death_list/EntityForm";
import GameSelector from "../components/ui/GameSelector";
import Loading from "../components/ui/Loading";
import NoDeathListFound from "../components/death_list/NoDeathListFound";
import { useDeathLists } from "../context/deathCounter/DeathCounterContext";
import { useIsMobile } from "../hooks/useIsMobile";

const DashboardPage = () => {
  const {deathLists, isLoading} = useDeathLists();

  const isMobile = useIsMobile();

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
          <EntityForm/>
        </>
      ) : (
        <NoDeathListFound/>
      )}
    </Container>
  )
}

export default DashboardPage
