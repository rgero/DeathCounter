import { Add, Upload } from "@mui/icons-material"
import { Box, Container, Divider, Typography } from "@mui/material"

import Button from "../ui/Button";
import { useModalProvider } from "../../context/modal/ModalContext";

const NoDeathListFound = () => {
  const {toggleCreateNewModal, toggleImportModal} = useModalProvider();
  return (
    <Container>
      <Typography variant="h4">Dashboard</Typography>
      <Divider sx={{ my: 2 }} />
      <Box sx={{textAlign: "center", paddingTop: "20px"}}>
        <Typography variant="h5">No active death counter found.</Typography>
        <Typography variant="body1">Please create a new death counter to start tracking.</Typography>
        <Box sx={{textAlign: "center", paddingTop: "30px", gap:5, display: "flex", justifyContent: "center"}}>
          <Button
            icon={<Add />}
            onClick={toggleCreateNewModal}
            title="Create"/>
          <Button
            icon={<Upload/>}
            onClick={toggleImportModal}
            title="Import"/>
        </Box>
      </Box>
    </Container>
  )
}

export default NoDeathListFound
