import { Collapse, TextField } from "@mui/material";
import { useEffect, useState } from "react";

import { useDeathLists } from "../../context/deathCounter/DeathCounterContext";

const DeathDescription = () => {
  const { showDescription, activeDeathList, updateDeathList } = useDeathLists();
  const [localDescription, setLocalDescription] = useState("");

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
      <TextField
        label="Description"
        fullWidth
        multiline
        maxRows={2}
        value={localDescription}
        onChange={(e) => setLocalDescription(e.target.value)}
        onBlur={handleBlur}
        sx={{marginY: "20px"}}
      />
    </Collapse>
  );
};

export default DeathDescription;
