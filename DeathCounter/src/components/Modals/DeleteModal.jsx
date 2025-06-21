import { Button, Grid, Typography } from "@mui/material";

import BaseModal from "./BaseModal";
import { useDeathTracker } from "../../context/DeathTrackerContext";
import { useDialogProvider } from "../../context/DialogContext";

const DeleteModal = ({open}) => {
  const {deleteItem, currentlySelected} = useDeathTracker();
  const {toggleDeleteDialog} = useDialogProvider();
  
  const processDelete = () => {
    deleteItem(currentlySelected.id);
    toggleDeleteDialog();
  }

  if (!currentlySelected) { return; }

  return (
    <BaseModal
      open={open}
      handleClose={toggleDeleteDialog}
      label="confirm-delete"
    >
      <Grid container justifyContent="center" spacing={5}>
        <Grid item>
          <Typography>Are you sure?</Typography>
          <Typography>You might want to save the data just in case</Typography>
          <Typography>{currentlySelected.name} - {currentlySelected.deaths}</Typography>
        </Grid>
        <Grid container item justifyContent="space-evenly">
          <Grid item>
            <Button onClick={toggleDeleteDialog} variant="contained" color="error">No</Button>
          </Grid>
          <Grid item>
            <Button onClick={processDelete} variant="contained" color="success">Delete</Button>
          </Grid>
        </Grid>
      </Grid>
    </BaseModal>
  )
}

export default DeleteModal
