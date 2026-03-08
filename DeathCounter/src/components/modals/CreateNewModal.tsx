import { Cancel, Check } from "@mui/icons-material";
import { Grid, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";

import BaseModal from "./BaseModal";
import Button from "../ui/Button";
import { DeathList } from '@interfaces/DeathList';
import { useDeathLists } from '@context/deathCounter/DeathCounterContext';
import { useIsMobile } from '@hooks/useIsMobile';
import { useModalProvider } from '@context/modal/ModalContext';

const CreateNewModal = () => {
  const {createNewModalOpen, toggleCreateNewModal} = useModalProvider();
  const {addDeathList} = useDeathLists();
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isMobile = useIsMobile();

  const handleSubmit = async () => {
    const newDeathList: DeathList = {
      name: name.trim(),
      currentlyActive: false,
      entityList: []
    }
    addDeathList(newDeathList);
    setName("");
    toggleCreateNewModal();
  };
  
  return (
    <BaseModal
      open={createNewModalOpen}
      handleClose={toggleCreateNewModal}
      label="create-new"
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
          <Typography variant={isMobile ? "h5" : "h4"}>Create new Death Counter?</Typography>
        </Grid>
        <Grid>
          <TextField
            inputRef={inputRef}
            variant="standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              fontSize: "2rem",
              fontWeight: 500,
              "& input": {
                fontSize: "2rem",
                fontWeight: 500,
                padding: 0,
                width: "100%",
              },
            }}
          />
        </Grid>
        <Grid container direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid>
            <Button
              icon={<Cancel />}
              onClick={toggleCreateNewModal}
              title="Cancel"
            />
          </Grid>
          <Grid>
            <Button
              icon={<Check />}
              onClick={handleSubmit}
              title="Submit"
            />
          </Grid>
        </Grid>
      </Grid>
    </BaseModal>
  );
}

export default CreateNewModal
