import { Cancel, Check } from "@mui/icons-material";
import { Grid, IconButton, Typography } from "@mui/material";

import BaseModal from "./BaseModal";
import { useDeathLists } from "../../context/DeathCounterContext";
import { useModalProvider } from "../../context/ModalContext";

const DeleteListModal = () => {
  const {deleteModalOpen, toggleDeleteModal} = useModalProvider();
  const {activeDeathList, removeDeathList} = useDeathLists();

  const confirmDelete = async () => {
    if (activeDeathList?.id) {
      await removeDeathList(activeDeathList.id);
      toggleDeleteModal();
    }
  }

  return (
    <BaseModal
      open={deleteModalOpen}
      handleClose={toggleDeleteModal}
      label="delete-list"
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
          <Typography>Delete {activeDeathList?.name}?</Typography>
        </Grid>
        <Grid container direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid>
            <IconButton onClick={toggleDeleteModal}>
              <Cancel/>
            </IconButton>
          </Grid>
          <Grid>
            <IconButton onClick={confirmDelete}>
              <Check/>
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </BaseModal>
  );
};

export default DeleteListModal
