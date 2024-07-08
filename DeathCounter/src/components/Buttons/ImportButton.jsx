import { IconButton, Tooltip } from '@mui/material';

import FileUploadIcon from '@mui/icons-material/FileUpload';
import ImportModal from '../Modals/ImportModal';
import { useState } from 'react';

const ImportButton = () => {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <ImportModal open={isOpen} handleClose={() => setOpen(false)}/>
      <Tooltip title="Import Data">
        <IconButton onClick={() => setOpen(true)}>
          <FileUploadIcon/>
        </IconButton>
      </Tooltip>
    </>
  )
}

export default ImportButton
