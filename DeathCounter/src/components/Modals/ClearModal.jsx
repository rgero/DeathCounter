import { Button, Grid, Modal, Typography } from "@mui/material";

import BaseModal from "./BaseModal";
import { useDeathTracker } from "../../context/DeathTrackerContext";
import { useDialogProvider } from "../../context/DialogContext";

const ClearModal = ({open}) => {
  const {clearItems} = useDeathTracker();
  const {toggleClearDialog} = useDialogProvider();
  
  const processClear = () => {
    clearItems();
    toggleClearDialog();
  }

  return (
    <BaseModal
      open={open}
      handleClose={toggleClearDialog}
      label="confirm-clear"
    >
      <Grid container justifyContent="center" spacing={5}>
        <Grid item>
          <Typography>Are you sure?</Typography>
          <Typography>You might want to save the data just in case</Typography>
        </Grid>
        <Grid container item justifyContent="space-evenly">
          <Grid item>
            <Button onClick={toggleClearDialog} variant="contained" color="error">No</Button>
          </Grid>
          <Grid item>
            <Button onClick={processClear} variant="contained" color="success">Clear</Button>
          </Grid>
        </Grid>
      </Grid>
    </BaseModal>
  )
}

export default ClearModal
