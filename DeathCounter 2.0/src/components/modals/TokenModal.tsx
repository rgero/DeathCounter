import { Grid, IconButton, Typography } from "@mui/material"

import BaseModal from "./BaseModal"
import { useDeathLists } from "../../context/DeathCounterContext"
import { useModalProvider } from "../../context/ModalContext"

const TokenModal = () => {
  const {tokenModalOpen, toggleTokenModal} = useModalProvider()
  const {getCurrentlyActiveDeathList, isLoading} = useDeathLists()

  const currentlyActiveDeathList = getCurrentlyActiveDeathList();
  if (isLoading || !currentlyActiveDeathList) {
    return null;
  }

  return (
    <BaseModal
      open={tokenModalOpen}
      handleClose={toggleTokenModal}
      label="token-modal"
    >
      <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2}>
        <Grid>
          <Typography variant="h6">{currentlyActiveDeathList.name} - Token</Typography>
        </Grid>
        <Grid>
          <Typography variant="body1">Token: {currentlyActiveDeathList.token}</Typography>
        </Grid>
        <Grid>
          <Typography variant="body2">Stub for Regenerating Token</Typography>
        </Grid>
        <Grid>
          <IconButton onClick={toggleTokenModal}>
            <Typography variant="body2">Close</Typography>
          </IconButton>
        </Grid>
      </Grid>
    </BaseModal>
  )
}

export default TokenModal
