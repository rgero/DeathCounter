import { Button, Grid, Typography } from "@mui/material";

import BaseModal from "./BaseModal";
import { useModalProvider } from "../../context/ModalContext";
import { useState } from "react";

const ImportModal = ( ) => {
  const { importModalOpen, toggleImportModal } = useModalProvider();
  const [file, setFile] = useState<File|null>(null);
  const [fileData, setFileContent] = useState([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files?.[0];
    setFile(newFile);

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
  };

  const processUpload = () => {
    if (fileData) {
      try {
        console.log(fileData);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <BaseModal
      open={importModalOpen}
      handleClose={toggleImportModal}
      label="import-file"
    >
      <Grid
        container
        direction="column"
        justifyItems="center"
        alignItems="center"
        spacing={5}
        sx={{ pt: 2 }}
      >
        <Grid>
          <Typography>Please select a file</Typography>
        </Grid>

        <Grid>
          <Button variant="outlined" component="label">
            {file ? file.name : "Choose JSON File"}
            <input
              type="file"
              accept="application/json"
              hidden
              onChange={handleFileChange}
            />
          </Button>
        </Grid>

        <Grid container justifyContent="flex-end">
          <Grid>
            <Button
              onClick={processUpload}
              variant="contained"
              color="success"
              disabled={!file}
            >
              Upload
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </BaseModal>
  );
};

export default ImportModal;
