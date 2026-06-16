import { Grid, IconButton, TextField } from "@mui/material";
import { useRef, useState } from "react";

import GameMenuButton from "../game_menu/GameMenuButton";
import { Info } from "@mui/icons-material";
import { DeathList } from "@interfaces/DeathList";
import { useDeathLists } from '@context/deathCounter/DeathCounterContext';

interface DeathlistHeaderFormProps {
  activeDeathList: DeathList;
  showDescription: boolean;
  toggleDescription: () => void;
  updateDeathList: (deathList: DeathList) => Promise<void>;
}

const DeathlistHeaderForm = ({
  activeDeathList,
  showDescription,
  toggleDescription,
  updateDeathList,
}: DeathlistHeaderFormProps) => {
  const [name, setName] = useState(activeDeathList.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (name === activeDeathList.name) return;
    await updateDeathList({ ...activeDeathList, name });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      inputRef.current?.blur();
    }
  };

  return (
    <Grid
      container
      sx={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "nowrap",
        paddingBottom: 2,
      }}
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
        <Grid container sx={{ flexWrap: "nowrap" }}>
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

const DeathlistHeader = () => {
  const {
    activeDeathList,
    isLoading,
    updateDeathList,
    showDescription,
    toggleDescription,
  } = useDeathLists();

  if (isLoading || !activeDeathList) return null;

  return (
    <DeathlistHeaderForm
      key={activeDeathList.id}
      activeDeathList={activeDeathList}
      showDescription={showDescription}
      toggleDescription={toggleDescription}
      updateDeathList={updateDeathList}
    />
  );
};

export default DeathlistHeader;
