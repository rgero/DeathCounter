import { IconButton, Tooltip } from '@mui/material';

import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useDialogProvider } from '../../context/DialogContext';

const ImportButton = () => {
  const {toggleImportDialog} = useDialogProvider();
  return (
    <>
      <Tooltip title="Import Data">
        <IconButton onClick={toggleImportDialog}>
          <FileUploadIcon/>
        </IconButton>
      </Tooltip>
    </>
  )
}

export default ImportButton
