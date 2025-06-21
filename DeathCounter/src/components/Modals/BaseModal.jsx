import { Box, Modal } from "@mui/material"

import { isMobile } from "../../utils/isMobile";

const BaseModal = ({children, label, open, handleClose}) => {
  const isMobileDevice = isMobile();

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isMobileDevice ? "90%" : 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 5,
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby={label}
    >
      <Box sx={{ ...style }}>
        {children}
      </Box>
    </Modal>
  )
}

export default BaseModal
