import { Box, Modal, Typography } from "@mui/material"

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const DeathEntityModal = ({closeFn, isOpen, targetItem = {}}) => {
  return (
    <Modal
      open={isOpen}
      onClose={closeFn}
    >
      <Box sx={style}>
        <Typography>
          {targetItem?.name}
        </Typography>
        <Typography>
          {targetItem?.deaths}
        </Typography>
      </Box>
    </Modal>
  )
}

export default DeathEntityModal
