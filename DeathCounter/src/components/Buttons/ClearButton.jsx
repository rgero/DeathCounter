import { IconButton, Tooltip } from '@mui/material';

import ClearIcon from '@mui/icons-material/Clear';
import ClearModal from '../Modals/ClearModal';
import { useState } from 'react';

const ClearButton = () => {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <ClearModal open={isOpen} handleClose={() => setOpen(false)}/>
      <Tooltip title="Clear All">
        <IconButton onClick={() => setOpen(true)}>
          <ClearIcon/>
        </IconButton>
      </Tooltip>
    </>
  )
}

export default ClearButton
