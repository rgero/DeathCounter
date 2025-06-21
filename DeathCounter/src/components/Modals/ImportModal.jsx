import { Button, Grid, Typography } from "@mui/material";

import BaseModal from "./BaseModal";
import { MuiFileInput } from "mui-file-input";
import { useDeathTracker } from "../../context/DeathTrackerContext";
import { useDialogProvider } from "../../context/DialogContext";
import { useState } from "react";

const ImportModal = ({open}) => {
  const {setItems, setGameName, clearItems} = useDeathTracker();
  const {toggleImportDialog} = useDialogProvider();
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
      try {
        clearItems();

        if (fileData.gameName)
        {
          setGameName(fileData.gameName);
        }

        if (fileData.deathList)
        {
          setItems(fileData.deathList);
        }

        // Clear the data
        setFile(null);
        setFileContent([]);
        toggleImportDialog();
      } catch (e) {
        console.error(e);
      }
    }
  }

  return (
    <BaseModal
      open={open}
      handleClose={toggleImportDialog}
      label="import-file"
    >
      <Grid container direction="column" justifyItems="center" alignItems="center" spacing={5} sx={{pt: 2,}}>
        <Grid item>
          <Typography>Please select a file</Typography>
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
    </BaseModal>
  )
}

export default ImportModal
