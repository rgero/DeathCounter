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

const ClearModal = ({open, handleClose}) => {
  const {clearItems} = useDeathTracker();

  const processClear = () => {
    clearItems();
    handleClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="confirm-clear"
    >
      <Grid container justifyContent="center" spacing={5} sx={{ ...style}}>
        <Grid item>
          <Typography>Are you sure?</Typography>
          <Typography>You might want to save the data just in case</Typography>
        </Grid>
        <Grid container item justifyContent="space-evenly">
          <Grid item>
            <Button onClick={handleClose} variant="contained" color="error">No</Button>
          </Grid>
          <Grid item>
            <Button onClick={processClear} variant="contained" color="success">Clear</Button>
          </Grid>
        </Grid>
      </Grid>
    </Modal>
  )
}

export default ClearModal
