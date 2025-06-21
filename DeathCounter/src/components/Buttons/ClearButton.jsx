import { IconButton, Tooltip } from '@mui/material';

import ClearIcon from '@mui/icons-material/Clear';
import { useDialogProvider } from '../../context/DialogContext';

const ClearButton = () => {
  const {toggleClearDialog} = useDialogProvider();
  return (
    <>
      <Tooltip title="Clear All">
        <IconButton onClick={toggleClearDialog}>
          <ClearIcon/>
        </IconButton>
      </Tooltip>
    </>
  )
}

export default ClearButton
