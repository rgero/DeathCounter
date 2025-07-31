import { Box, Container, Typography } from "@mui/material"

import { Add } from "@mui/icons-material";
import Button from "../components/ui/Button";
import DeathListTable from "../components/death_list/DeathListTable";
import DeathlistHeader from "../components/death_list/DeathlistHeader";
import EntityForm from "../components/death_list/EntityForm";
import GameSelector from "../components/ui/GameSelector";
import Loading from "../components/ui/Loading";
import { useDeathLists } from "../context/deathCounter/DeathCounterContext";
import { useIsMobile } from "../hooks/useIsMobile";
import { useModalProvider } from "../context/modal/ModalContext";

const DashboardPage = () => {
  const {deathLists, isLoading} = useDeathLists();
  const {toggleCreateNewModal} = useModalProvider();
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
        <Box sx={{textAlign: "center", paddingTop: "20px"}}>
          <Typography variant="h5">No active death counter found.</Typography>
          <Typography variant="body1">Please create a new death counter to start tracking.</Typography>
          <Box sx={{textAlign: "center", paddingTop: "30px"}}>
            <Button
              icon={<Add />}
              onClick={() => toggleCreateNewModal()}
              title="Create New"/>
          </Box>
        </Box>
      )}
    </Container>
  )
}

export default DashboardPage
