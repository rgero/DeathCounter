import { Grid, Typography, useTheme } from "@mui/material"

import { Entity } from '@interfaces/Entity';
import { useDeathLists } from '@context/deathCounter/DeathCounterContext';

const DeathEntity = ({ index, data }: { index: number; data: Entity }) => {
  const { setEntityInEdit } = useDeathLists();
  const theme = useTheme();

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      onClick={() => setEntityInEdit(data)}
      sx={{
        px: 1,
        py: 0.5,
        backgroundColor: index % 2 === 0 ? "transparent" : theme.palette.grey[900],
        cursor: "pointer",
        transition: "background-color 0.2s ease",
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
        },
      }}
    >
      <Grid size={10}>
        <Typography>{data.name}</Typography>
      </Grid>
      <Grid size={2}>
        <Typography align="right">{data.deaths}</Typography>
      </Grid>
    </Grid>
  );
};

export default DeathEntity;
