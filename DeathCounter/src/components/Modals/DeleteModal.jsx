import { Button, Grid, Modal, Typography } from "@mui/material";

import { useDeathTracker } from "../../context/DeathTrackerContext";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 5,
};

const DeleteModal = ({open, handleClose, target}) => {
  const {deleteItem} = useDeathTracker();
  const processDelete = () => {
    deleteItem(target.id);
    handleClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="confirm-delete"
    >
      <Grid container justifyContent="center" spacing={5} sx={{ ...style}}>
        <Grid item>
          <Typography>Are you sure?</Typography>
          <Typography>You might want to save the data just in case</Typography>
          <Typography>{target.name} - {target.deaths}</Typography>
        </Grid>
        <Grid container item justifyContent="space-evenly">
          <Grid item>
            <Button onClick={handleClose} variant="contained" color="error">No</Button>
          </Grid>
          <Grid item>
            <Button onClick={processDelete} variant="contained" color="success">Delete</Button>
          </Grid>
        </Grid>
      </Grid>
    </Modal>
  )
}

export default DeleteModal
