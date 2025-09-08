import { Box, Collapse, TextField } from "@mui/material";
import { useEffect, useState } from "react";

import { grey } from "@mui/material/colors";
import { useDeathLists } from "../../context/deathCounter/DeathCounterContext";
import { useIsMobile } from "../../hooks/useIsMobile";

const DeathDescription = () => {
  const { showDescription, activeDeathList, updateDeathList } = useDeathLists();
  const [localDescription, setLocalDescription] = useState("");

    const isMobile = useIsMobile();

  useEffect(() => {
    setLocalDescription(activeDeathList?.description || "");
  }, [activeDeathList]);

  const handleBlur = () => {
    if (localDescription !== activeDeathList?.description && activeDeathList?.name) {
      updateDeathList({ ...activeDeathList, description: localDescription });
    }
  };

  return (
    <Collapse in={showDescription} timeout={500}>
      <Box sx={{
            backgroundColor: `${grey[900]}`,
            padding: "10px",
            borderRadius: 5,
            boxShadow: 3,
            marginY: "10px",
            width: isMobile ? "90%" : "500px",
            mx: "auto"
          }}
      >
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={4}
          maxRows={4}
          value={localDescription}
          onChange={(e) => setLocalDescription(e.target.value)}
          onBlur={handleBlur}
          sx={{marginY: "20px"}}
        />
      </Box>
    </Collapse>
  );
};

export default DeathDescription;
