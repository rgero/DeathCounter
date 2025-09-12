import { Add, Remove } from "@mui/icons-material";
import { Button, Container, FormControl, FormHelperText, Grid, IconButton, Paper, TextField } from "@mui/material"
import React, { useCallback, useEffect } from "react"

import { Entity } from "../../interfaces/Entity";
import { WsMessage } from "../../interfaces/WsMessage";
import toast from "react-hot-toast";
import { useDeathLists } from "../../context/deathCounter/DeathCounterContext";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useSocketContext } from "../../context/webSocket/WebSocketContext";

const EntityForm = () => {
  const { activeDeathList, addToList, entityInEdit, removeEntityFromList, setEntityInEdit } = useDeathLists();
  const { socket } = useSocketContext();
  const [id, setID] = React.useState<number>(-1);
  const [name, setName] = React.useState("");
  const [deaths, setDeaths] = React.useState(0);
  const [error, setError] = React.useState("");
  const [lastClick, setLastClick] = React.useState(new Date());
  const timeDelay: number = 1000;
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (!entityInEdit || !entityInEdit.id) {
      return;
    }

    setID(entityInEdit.id);
    setName(entityInEdit.name);
    setDeaths(entityInEdit.deaths);
    setError("");
  }, [entityInEdit]);

  useEffect(() => {
    if (!socket) return;

    const handleBossDeathIncrement = (event: WsMessage) => {
      if (!checkGameToken(event.gameToken)) return;
      processIncrement();
    };

    const handleBossDefeated = (event: WsMessage) => {
      if (!checkGameToken(event.gameToken)) return;
      processSubmit();
    };

    socket.on("bossDeathIncrement", handleBossDeathIncrement);
    socket.on("bossDefeated", handleBossDefeated);

    return () => {
      socket.off("bossDeathIncrement", handleBossDeathIncrement);
      socket.off("bossDefeated", handleBossDefeated);
    };
  }, [socket, name, deaths, id]);

  const checkGameToken = useCallback((gameToken: string|undefined) => {
    return gameToken === activeDeathList?.token;
  }, [activeDeathList?.token]);

  const canProcess = () => {
    const now = new Date();
    if (now.getTime() - lastClick.getTime() > timeDelay) {
      setLastClick(now);
      return true;
    } else {
      toast.error("Please wait before clicking again");
      return false;
    }
  };

  const processIncrement = () => {
    if (canProcess()) {
      setDeaths((prev) => prev + 1);
    }
  };

  const processDecrement = () => {
    if (canProcess()) {
      setDeaths((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          setError("Deaths cannot be negative");
          return 0;
        }
      });
    }
  };

  const clearForm = () => {
    setID(-1);
    setName("");
    setDeaths(0);
    setError("");
    setEntityInEdit(null);
  };

  const processSubmit = () => {
    if (name.trim() === "") {
      setError("Name must be filled out");
      return;
    }

    const itemToSubmit: Entity = { name: name.trim(), deaths };
    if (id !== -1) {
      itemToSubmit.id = id;
    }
    addToList(itemToSubmit);
    clearForm();
  };

  const processNumber = (num: string) => {
    if (/^\d*$/.test(num)) {
      setDeaths(Number(num));
    }
  };

  const removeEntity = () => {
    if (id === -1) {
      setError("No entity selected to remove");
      return;
    }
    removeEntityFromList(id);
    clearForm();
  };

  return (
    <Paper sx={{ marginTop: 2, padding: 2, borderRadius: 5, width: isMobile ? "90%" : "500px", mx: "auto" }}>
      <FormControl fullWidth error={Boolean(error)}>
        <Container>
          <Grid container justifyContent="center" alignItems="center" spacing={isMobile ? 3 : 0} direction={isMobile ? "column" : "row"} sx={{ paddingBottom: 2 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Name"
                value={name}
                error={Boolean(error)}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Deaths"
                value={deaths}
                onChange={(e) => {
                  processNumber(e.target.value);
                }}
              />
            </Grid>
            <Grid container justifyContent="space-evenly" alignItems="center" paddingTop={isMobile ? 1: 2} spacing={2}>
              <IconButton color="error" onClick={processDecrement}>
                <Remove />
              </IconButton>
              <IconButton color="success" onClick={processIncrement}>
                <Add />
              </IconButton>
            </Grid>
          </Grid>
          <Grid container justifyContent="flex-end" alignItems="center" spacing={2}>
            {id !== -1 && (
              <Grid>
                <Button variant="outlined" onClick={removeEntity}>
                  Delete
                </Button>
              </Grid>
            )}
            <Grid>
              <Button variant="outlined" onClick={processSubmit}>
                {id !== -1 ? "Edit" : "Add"}
              </Button>
            </Grid>
          </Grid>
          <Grid container justifyContent={"center"} alignItems={"center"} paddingTop={2}>
            <Grid>
              <FormHelperText>{error}</FormHelperText>
            </Grid>
          </Grid>
        </Container>
      </FormControl>
    </Paper>
  );
};

export default EntityForm;
