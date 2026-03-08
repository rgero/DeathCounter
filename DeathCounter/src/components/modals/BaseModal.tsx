import { Box, Fade, Modal } from "@mui/material"

import { ReactNode } from "react";
import { useIsMobile } from '@hooks/useIsMobile';

interface BaseModalProps {
  children: ReactNode;
  label: string;
  open: boolean;
  handleClose: () => void;
}

const BaseModal = ({children, label, open, handleClose}: BaseModalProps) => {
  const isMobile = useIsMobile();
  
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
