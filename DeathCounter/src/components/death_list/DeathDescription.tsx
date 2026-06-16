import { Box, Collapse, TextField } from "@mui/material";
import { useState } from "react";

import GameStats from "../stats/GameStats";
import { grey } from "@mui/material/colors";
import { DeathList } from "@interfaces/DeathList";
import { useDeathLists } from '@context/deathCounter/DeathCounterContext';
import { useIsMobile } from '@hooks/useIsMobile';

interface DescriptionEditorProps {
  activeDeathList: DeathList;
  updateDeathList: (deathList: DeathList) => Promise<void>;
  isMobile: boolean;
}

const DescriptionEditor = ({
  activeDeathList,
  updateDeathList,
  isMobile,
}: DescriptionEditorProps) => {
  const [localDescription, setLocalDescription] = useState(activeDeathList.description || "");

  const handleBlur = () => {
    if (localDescription !== activeDeathList.description && activeDeathList.name) {
      updateDeathList({ ...activeDeathList, description: localDescription });
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: grey[900],
        padding: "20px",
        borderRadius: 5,
        boxShadow: 3,
        marginY: "10px",
        width: isMobile ? "90%" : "500px",
        mx: "auto",
      }}
    >
      <TextField
        label="Description"
        fullWidth
        multiline
        rows={4}
        value={localDescription}
        onChange={(e) => setLocalDescription(e.target.value)}
        onBlur={handleBlur}
        sx={{ marginY: "20px" }}
      />
      <GameStats />
    </Box>
  );
};

const DeathDescription = () => {
  const { showDescription, activeDeathList, updateDeathList } = useDeathLists();
  const isMobile = useIsMobile();

  if (!activeDeathList) return null;

  return (
    <Collapse in={showDescription} timeout={500}>
      <DescriptionEditor
        key={activeDeathList.id}
        activeDeathList={activeDeathList}
        updateDeathList={updateDeathList}
        isMobile={isMobile}
      />
    </Collapse>
  );
};

export default DeathDescription;
