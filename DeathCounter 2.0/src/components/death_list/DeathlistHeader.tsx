import { Grid, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import DeathListMenuButton from "./DeathListMenuButton";
import { useDeathLists } from "../../context/DeathCounterContext";

const DeathlistHeader = () => {
  const { activeDeathList, isLoading, updateDeathList } = useDeathLists();

  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeDeathList) {
      setName(activeDeathList.name);
    }
  }, [activeDeathList]);

  const handleSubmit = async () => {
    if (!activeDeathList || name === activeDeathList.name) return;

    activeDeathList.name = name;
    await updateDeathList(activeDeathList);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent newline or form submit
      inputRef.current?.blur(); // Force blur to trigger handleSubmit
    }
  };

  if (isLoading || !activeDeathList) return null;

  return (
    <Grid container direction="row" justifyContent="space-between" alignItems="center">
      <Grid>
        <TextField
          inputRef={inputRef}
          variant="standard"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          InputProps={{ disableUnderline: true }}
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
      <Grid>
        <DeathListMenuButton />
      </Grid>
    </Grid>
  );
};

export default DeathlistHeader;
