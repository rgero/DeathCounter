import { Button, Grid, Typography } from "@mui/material";

import BaseModal from "./BaseModal"
import GameSelector from "../ui/GameSelector";
import { useModalProvider } from '@context/modal/ModalContext';

const SwitchGameModal = () => {
  const {switchGameModalOpen, toggleSwitchGameModal} = useModalProvider();
  return (
    <BaseModal
      open={switchGameModalOpen}
      handleClose={toggleSwitchGameModal}
      label="switch-game"
    >
      <Grid container justifyContent="center" alignItems="center" sx={{ mb: 2 }} direction="column" spacing={4}>
        <Grid>
          <Typography variant="h5">Switch Game</Typography></Grid>
        <Grid>
          <GameSelector/>
        </Grid>
        <Grid>
          <Button variant="outlined" onClick={toggleSwitchGameModal}>Close</Button>
        </Grid>
      </Grid>
    </BaseModal>
  )
}

export default SwitchGameModal
