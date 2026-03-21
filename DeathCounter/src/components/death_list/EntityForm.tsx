import { Add, Remove } from "@mui/icons-material";
import { Button, Container, Fade, FormControl, FormHelperText, Grid, Paper, TextField } from "@mui/material";
import React, { useCallback, useEffect, useRef } from "react";

import { Entity } from "@interfaces/Entity";
import { WsMessage } from "@interfaces/WsMessage";
import toast from "react-hot-toast";
import { useDeathLists } from "@context/deathCounter/DeathCounterContext";
import { useIsMobile } from "@hooks/useIsMobile";
import { useSocketContext } from "@context/webSocket/WebSocketContext";

const EntityForm = () => {
  const { activeDeathList, addToList, entityInEdit, removeEntityFromList, setEntityInEdit, refetch } = useDeathLists();
  const { socket, emitMessage } = useSocketContext();

  const [id, setID] = React.useState<number>(-1);
  const [name, setName] = React.useState("");
  const [deaths, setDeaths] = React.useState(0);
  const [error, setError] = React.useState("");
  const [lastClick, setLastClick] = React.useState(new Date());

  const timeDelay: number = 1000;
  const isMobile = useIsMobile();

  const stateRef = useRef({ name, deaths, id });

  useEffect(() => {
    stateRef.current = { name, deaths, id };
  }, [name, deaths, id]);

  const checkGameToken = useCallback(
    (gameToken: string | undefined) => {
      return gameToken === activeDeathList?.token;
    },
    [activeDeathList?.token],
  );

  useEffect(() => {
    if (!entityInEdit || !entityInEdit.id) return;
    setID(entityInEdit.id);
    setName(entityInEdit.name);
    setDeaths(entityInEdit.deaths);
    setError("");
  }, [entityInEdit]);

  const clearForm = useCallback(() => {
    setID(-1);
    setName("");
    setDeaths(0);
    setError("");
    setEntityInEdit(null);
  }, [setEntityInEdit]);

  const processSubmit = useCallback(() => {
    const current = stateRef.current;
    if (current.name.trim() === "") {
      setError("Name must be filled out");
      return;
    }

    const itemToSubmit: Entity = {
      name: current.name.trim(),
      deaths: current.deaths,
    };

    if (current.id !== -1) {
      itemToSubmit.id = current.id;
    }

    addToList(itemToSubmit);
    emitMessage("bossDefeated");
  }, [addToList, emitMessage]);

  useEffect(() => {
    if (!socket) return;

    const handleIncrement = (event: WsMessage) => {
      if (!checkGameToken(event.gameToken)) return;
      setDeaths((prev) => prev + 1);
    };

    const handleDecrement = (event: WsMessage) => {
      if (!checkGameToken(event.gameToken)) return;
      setDeaths((prev) => (prev > 0 ? prev - 1 : 0));
    };

    const handleBossDefeated = (event: WsMessage) => {
      if (!checkGameToken(event.gameToken)) return;
      clearForm();
      refetch();
    };

    const handleDeathSet = (event: WsMessage) => {
      if (!checkGameToken(event.gameToken)) return;
      if (typeof event.data === "number") setDeaths(event.data);
    };

    const handleBossNameSet = (event: WsMessage) => {
      if (!checkGameToken(event.gameToken)) return;
      if (typeof event.data === "string") setName(event.data);
    };

    socket.on("bossDeathIncrement", handleIncrement);
    socket.on("bossDeathDecrement", handleDecrement);
    socket.on("bossDefeated", handleBossDefeated);
    socket.on("bossDeathSet", handleDeathSet);
    socket.on("bossNameSet", handleBossNameSet);
    return () => {
      socket.off("bossDeathIncrement", handleIncrement);
      socket.off("bossDeathDecrement", handleDecrement);
      socket.off("bossDefeated", handleBossDefeated);
      socket.off("bossDeathSet", handleDeathSet);
      socket.off("bossNameSet", handleBossNameSet);
    };
  }, [socket, checkGameToken, clearForm]);

  const canProcess = () => {
    const now = new Date();
    if (now.getTime() - lastClick.getTime() > timeDelay) {
      setLastClick(now);
      return true;
    }
    toast.error("Please wait before clicking again");
    return false;
  };

  const processIncrement = () => {
    if (canProcess()) emitMessage("bossDeathIncrement");
  };

  const processDecrement = () => {
    if (canProcess()) emitMessage("bossDeathDecrement");
  };

  const removeEntity = () => {
    if (id === -1) {
      setError("No entity selected to remove");
      return;
    }
    removeEntityFromList(id);
    clearForm();
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    if (error) setError("");
  };

  const handleDeathsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setDeaths(isNaN(value) ? 0 : value);
  };

  const applyBossName = () => {
    emitMessage("bossNameSet", name);
  };

  const applyBossDeaths = () => {
    if (deaths < 0) {
      setError("Deaths cannot be negative");
      return;
    }
    emitMessage("bossDeathSet", deaths);
  };

  return (
    <Paper
      sx={{
        marginTop: 2,
        padding: 2,
        borderRadius: 5,
        width: isMobile ? "90%" : "500px",
        mx: "auto",
      }}
    >
      <FormControl fullWidth error={Boolean(error)}>
        <Container>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={2}
            direction={{ xs: "column", md: "row" }}
            sx={{ paddingBottom: 2 }}
          >
            <Grid size={{ xs: 12, sm: 6, md: 8 }}>
              <TextField
                fullWidth
                label="Name"
                value={name}
                error={Boolean(error)}
                onChange={handleNameChange}
                onBlur={applyBossName} // Emit only on loss of focus
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                label="Deaths"
                type="number"
                value={deaths}
                onChange={handleDeathsChange}
                onBlur={applyBossDeaths} // Emit only on loss of focus
              />
            </Grid>
          </Grid>

          <Grid
            container
            justifyContent="center"
            alignItems="center"
            paddingY={isMobile ? 1 : 2}
            spacing={2}
          >
            <Grid>
              <Button
                variant="outlined"
                color="error"
                onClick={processDecrement}
                sx={{ minWidth: 128, minHeight: 48 }}
              >
                <Remove />
              </Button>
            </Grid>
            <Grid>
              <Button
                variant="outlined"
                color="success"
                onClick={processIncrement}
                sx={{ minWidth: 128, minHeight: 48 }}
              >
                <Add />
              </Button>
            </Grid>
          </Grid>

          <Grid
            container
            justifyContent="flex-end"
            alignItems="center"
            spacing={2}
          >
            <Fade in={id !== -1} unmountOnExit>
              <Grid>
                <Button variant="outlined" color="error" onClick={removeEntity}>
                  Delete
                </Button>
              </Grid>
            </Fade>
            <Fade in={Boolean(name) || deaths > 0} unmountOnExit>
              <Grid>
                <Button variant="outlined" onClick={clearForm}>
                  Clear
                </Button>
              </Grid>
            </Fade>
            <Grid>
              <Button variant="contained" onClick={processSubmit}>
                {id !== -1 ? "Update" : "Add"}
              </Button>
            </Grid>
          </Grid>

          {error && (
            <Grid container justifyContent="center" paddingTop={2}>
              <FormHelperText>{error}</FormHelperText>
            </Grid>
          )}
        </Container>
      </FormControl>
    </Paper>
  );
};

export default EntityForm;