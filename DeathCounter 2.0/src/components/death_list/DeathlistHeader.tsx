import { Grid, Typography } from "@mui/material"

import DeathListMenuButton from "./DeathListMenuButton";
import { useDeathLists } from "../../context/DeathCounterContext";

const DeathlistHeader = () => {
  const {getCurrentlyActiveDeathList, isLoading} = useDeathLists();

  const currentlyActiveDeathList = getCurrentlyActiveDeathList();

  if (isLoading || !currentlyActiveDeathList) {
    return null;
  }

  return (
    <Grid container direction="row" justifyContent="space-between">
      <Grid>
        <Typography variant="h4">{currentlyActiveDeathList.name}</Typography>
      </Grid>
      <Grid>
        <DeathListMenuButton/>
      </Grid>
    </Grid>
  )
}

export default DeathlistHeader
