import { Button, Grid, Modal, Typography } from "@mui/material";

import { MuiFileInput } from "mui-file-input";
import { useDeathTracker } from "../../context/DeathTrackerContext";
import { useState } from "react";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 5,
};

const ImportModal = ({open, handleClose}) => {
  const {setItems, clearItems} = useDeathTracker();
  const [file, setFile] = useState(null);
  const [fileData, setFileContent] = useState([]);

  const handleFileChange = (newFile) => {
    setFile(newFile)
    if (newFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = JSON.parse(e.target.result);
          setFileContent(content);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      reader.readAsText(newFile);
    }
  }

  const processUpload = () => {
    if (fileData)
    {
      // There definitely needs to be validation of the data.

      clearItems();
      setItems(fileData);

      // Clear the data
      setFile(null);
      setFileContent([]);
      handleClose();
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="confirm-clear"
    >
      <Grid container justifyContent="center" spacing={5} sx={{ ...style}}>
        <Grid item>
          <Typography justifyContent="center">Please select a file</Typography>
        </Grid>
        <Grid item>
          <MuiFileInput
            placeholder="Insert a file"
            value={file}
            onChange={handleFileChange}
            InputProps={{
              inputProps: {
                accept: "application/json"
              }
            }}
          />
        </Grid>
        <Grid container item justifyContent="flex-end">
          <Grid item>
            <Button onClick={processUpload} variant="contained" color="success">Upload</Button>
          </Grid>
        </Grid>
      </Grid>
    </Modal>
  )
}

export default ImportModal
