import { Container, Grid, Paper, TextField, Typography, useTheme } from "@mui/material"

import ClearButton from "../Buttons/ClearButton"
import DeleteButton from "../Buttons/DeleteButton"
import ExportButton from "../Buttons/ExportButton"
import ImportButton from "../Buttons/ImportButton"
import SearchButton from "../Buttons/SearchButton"
import { isMobile } from "../../utils/isMobile"
import { useDeathTracker } from "../../context/DeathTrackerContext"

const DeathPageHeader = ({deaths}) => {
  const {gameName, setGameName} = useDeathTracker();

  const processGameName = (e) => {
    setGameName(e.target.value);
  }

  return (
    <Paper sx={{borderRadius: 5}}>
      <Grid container 
        justifyContent="space-between" 
        direction={isMobile() ? "column" : "row"}
        spacing={isMobile() ? 2 : 0.5}
        alignItems="center"
        sx={{padding: 2}}
      >
        <Grid item xs={4}>
          <TextField label="Game Name" size="small" fullWidth value={gameName} onChange={processGameName}/>
        </Grid>
        <Grid item xs={4}>
          <Typography textAlign="center">
            Bosses: {deaths.length} | 
            Deaths: {deaths.reduce((total, currentItem) => total + currentItem.deaths, 0)}
          </Typography>
        </Grid>
        <Grid item>
          <SearchButton/>
          <DeleteButton/>
          <ClearButton/>
          <ImportButton/>
          <ExportButton/>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default DeathPageHeader
