import { IconButton, Tooltip } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import DeleteModal from '../Modals/DeleteModal';
import { useState } from 'react';

const DeleteButton = ({target}) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <DeleteModal open={isOpen} handleClose={() => setOpen(false)} target={target}/>
      <Tooltip title="Delete Item">
        <IconButton onClick={() => setOpen(true)}>
          <DeleteIcon/>
        </IconButton>
      </Tooltip>
    </>
  )
}

export default DeleteButton
