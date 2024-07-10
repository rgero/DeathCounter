import { IconButton, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import DeleteModal from '../Modals/DeleteModal';
import { useDeathTracker } from '../../context/DeathTrackerContext';

const DeleteButton = () => {
  const [isOpen, setOpen] = useState(false);
  const {currentlySelected} = useDeathTracker();
  const [current, setCurrent] = useState();

  useEffect( () => {
    setCurrent( currentlySelected );
  }, [currentlySelected])


  return (
    <>
      <DeleteModal open={isOpen} handleClose={() => setOpen(false)} target={current}/>
      <Tooltip disabled={!current} title="Delete Item">
        <span>
          <IconButton onClick={() => setOpen(true)} disabled={!current}>
            <DeleteIcon/>
          </IconButton>
        </span>
      </Tooltip>
    </>
  )
}

export default DeleteButton
