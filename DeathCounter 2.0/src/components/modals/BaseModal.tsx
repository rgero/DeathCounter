import { Box, Fade, Modal, useMediaQuery, useTheme } from "@mui/material"

const BaseModal = ({children, label, open, handleClose}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));


  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isMobile ? "90%" : 600,
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
      <Fade in={open}>
        <Box sx={{ ...style }}>
          {children}
        </Box>
      </Fade>
    </Modal>
  )
}

export default BaseModal
