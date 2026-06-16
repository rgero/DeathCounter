import { Add, Remove } from "@mui/icons-material";
import { Button, Container, Fade, FormControl, FormHelperText, Grid, Paper, TextField } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { BossData } from "@interfaces/BossData";
import { Entity } from "@interfaces/Entity";
import { WsMessage } from "@interfaces/WsMessage";
import toast from "react-hot-toast";
import { useDeathLists } from "@context/deathCounter/DeathCounterContext";
import { useIsMobile } from "@hooks/useIsMobile";
import { useSocketContext } from "@context/webSocket/WebSocketContext";

interface EntityFormFieldsProps {
  initialEntity?: Entity | null;
  activeDeathListToken: string | undefined;
  addToList: (entity: Entity) => Promise<void>;
  removeEntityFromList: (id: number) => Promise<void>;
  setEntityInEdit: (entity: Entity | null) => void;
  refetch: () => Promise<unknown>;
  socket: ReturnType<typeof useSocketContext>["socket"];
  emitMessage: ReturnType<typeof useSocketContext>["emitMessage"];
}

const EntityFormFields = ({
  initialEntity,
  activeDeathListToken,
  addToList,
  removeEntityFromList,
  setEntityInEdit,
  refetch,
  socket,
  emitMessage,
}: EntityFormFieldsProps) => {
  const [id, setID] = useState(initialEntity?.id ?? -1);
  const [name, setName] = useState(initialEntity?.name ?? "");
  const [deaths, setDeaths] = useState(initialEntity?.deaths ?? 0);
  const [error, setError] = useState("");
  const [lastClick, setLastClick] = useState(new Date());

  const timeDelay = 1000;
  const isMobile = useIsMobile();

  const stateRef = useRef({ name, deaths, id });

  useEffect(() => {
    stateRef.current = { name, deaths, id };
  }, [name, deaths, id]);

  const checkGameToken = useCallback(
    (gameToken: string | undefined) => gameToken === activeDeathListToken,
    [activeDeathListToken],
  );

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

    const handleClientConnected = (event: WsMessage) => {
      if (!checkGameToken(event.gameToken)) return;

      const { name: currentName, deaths: currentDeaths, id: currentId } = stateRef.current;

      if (currentName.trim() !== "" || currentDeaths > 0) {
        emitMessage("clientBossData", { id: currentId, name: currentName, deaths: currentDeaths });
      }
    };

    const handleBossDataRecieved = (event: WsMessage) => {
      if (!checkGameToken(event.gameToken)) return;

      if (typeof event.data === "object" && event.data !== null) {
        const eventData = event.data as BossData;
        setID(eventData.id ?? -1);
        setName(eventData.name);
        setDeaths(eventData.deaths);
      }
    };

    socket.on("bossDefeated", handleBossDefeated);
    socket.on("bossDeathSet", handleDeathSet);
    socket.on("bossNameSet", handleBossNameSet);
    socket.on("clientConnected", handleClientConnected);
    socket.on("clientBossData", handleBossDataRecieved);

    return () => {
      socket.off("bossDefeated", handleBossDefeated);
      socket.off("bossDeathSet", handleDeathSet);
      socket.off("bossNameSet", handleBossNameSet);
      socket.off("clientConnected", handleClientConnected);
      socket.off("clientBossData", handleBossDataRecieved);
    };
  }, [socket, checkGameToken, clearForm, emitMessage, refetch]);

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
    if (canProcess()) {
      emitMessage("bossDeathSet", deaths + 1);
    }
  };

  const processDecrement = () => {
    if (canProcess()) {
      emitMessage("bossDeathSet", deaths - 1);
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
    <FormControl fullWidth error={Boolean(error)}>
      <Container>
        <Grid
          container
          spacing={2}
          sx={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: { xs: "column", md: "row" },
            paddingBottom: 2,
          }}
        >
          <Grid size={{ xs: 12, sm: 6, md: 8 }}>
            <TextField
              fullWidth
              label="Name"
              value={name}
              error={Boolean(error)}
              onChange={handleNameChange}
              onBlur={applyBossName}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              label="Deaths"
              type="number"
              value={deaths}
              onChange={handleDeathsChange}
              onBlur={applyBossDeaths}
            />
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
          sx={{ justifyContent: "center", alignItems: "center", py: isMobile ? 1 : 2 }}
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

        <Grid container spacing={2} sx={{ justifyContent: "flex-end", alignItems: "center" }}>
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
          <Grid container sx={{ justifyContent: "center", pt: 2 }}>
            <FormHelperText>{error}</FormHelperText>
          </Grid>
        )}
      </Container>
    </FormControl>
  );
};

const EntityForm = () => {
  const {
    activeDeathList,
    addToList,
    entityInEdit,
    removeEntityFromList,
    setEntityInEdit,
    refetch,
  } = useDeathLists();
  const { socket, emitMessage } = useSocketContext();
  const isMobile = useIsMobile();

  const formKey = entityInEdit?.id != null ? `edit-${entityInEdit.id}` : "new";

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
      <EntityFormFields
        key={formKey}
        initialEntity={entityInEdit}
        activeDeathListToken={activeDeathList?.token}
        addToList={addToList}
        removeEntityFromList={removeEntityFromList}
        setEntityInEdit={setEntityInEdit}
        refetch={refetch}
        socket={socket}
        emitMessage={emitMessage}
      />
    </Paper>
  );
};

export default EntityForm;
