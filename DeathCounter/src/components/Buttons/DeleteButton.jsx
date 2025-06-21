import { IconButton, Tooltip } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import { useDeathTracker } from '../../context/DeathTrackerContext';
import { useDialogProvider } from '../../context/DialogContext';

const DeleteButton = () => {
  const {currentlySelected} = useDeathTracker();
  const {toggleDeleteDialog} = useDialogProvider();

  return (
    <>
      <Tooltip disabled={!currentlySelected} title="Delete Item">
        <span>
          <IconButton onClick={toggleDeleteDialog} disabled={!currentlySelected}>
            <DeleteIcon/>
          </IconButton>
        </span>
      </Tooltip>
    </>
  )
}

export default DeleteButton
