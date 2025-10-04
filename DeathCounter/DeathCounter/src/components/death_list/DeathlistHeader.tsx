import { Grid, IconButton, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import GameMenuButton from "../game_menu/GameMenuButton";
import { Info } from "@mui/icons-material";
import { useDeathLists } from "../../context/deathCounter/DeathCounterContext";

const DeathlistHeader = () => {
  const {
    activeDeathList,
    isLoading,
    updateDeathList,
    showDescription,
    toggleDescription,
  } = useDeathLists();

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
      e.preventDefault();
      inputRef.current?.blur();
    }
  };

  if (isLoading || !activeDeathList) return null;

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      wrap="nowrap"
      sx={{paddingBottom: 2}}
    >
      <Grid sx={{ flexGrow: 1, minWidth: 0 }}>
        <TextField
          inputRef={inputRef}
          variant="standard"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          fullWidth
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
      
      <Grid sx={{ flexShrink: 0, ml: 1 }}>
        <Grid container wrap="nowrap">
          <Grid>
            <IconButton onClick={toggleDescription}>
              <Info color={showDescription ? "primary" : undefined} />
            </IconButton>
          </Grid>
          <Grid>
            <GameMenuButton />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DeathlistHeader;
