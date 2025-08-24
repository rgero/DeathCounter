import { Button, Grid, Typography } from "@mui/material";

import BaseModal from "./BaseModal";
import { useDeathLists } from "../../context/deathCounter/DeathCounterContext";
import { useModalProvider } from "../../context/modal/ModalContext";

const ExportModal = () => {
  const { exportModalOpen, toggleExportModal } = useModalProvider();
  const { activeDeathList } = useDeathLists();

  const handleExport = async () => {
    if (!activeDeathList) return;

    try {
      // Convert to JSON string
      const json = JSON.stringify(activeDeathList, null, 2);

      // Create a Blob and object URL
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      // Create an invisible download link
      const link = document.createElement("a");
      link.href = url;
      link.download = `${activeDeathList.name || "deathlist"}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      URL.revokeObjectURL(url);

      toggleExportModal();
    } catch (e) {
      console.error("Export failed:", e);
    }
  };

  return (
    <BaseModal
      open={exportModalOpen}
      handleClose={toggleExportModal}
      label="export-file"
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
          <Typography>
            Export your current Death List as a JSON file
          </Typography>
        </Grid>

        <Grid container justifyContent="flex-end">
          <Grid>
            <Button
              onClick={handleExport}
              variant="contained"
              color="success"
              disabled={!activeDeathList}
            >
              Export
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </BaseModal>
  );
};

export default ExportModal;
