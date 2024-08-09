import { Container, Grid, TextField, Typography, useTheme } from "@mui/material"

import ClearButton from "../Buttons/ClearButton"
import DeleteButton from "../Buttons/DeleteButton"
import ExportButton from "../Buttons/ExportButton"
import ImportButton from "../Buttons/ImportButton"
import SearchButton from "../Buttons/SearchButton"
import { offsetHexColor } from "../../utils/HexColorOffset"
import { useDeathTracker } from "../../context/DeathTrackerContext"

const DeathPageHeader = ({deaths}) => {
  const theme = useTheme();
  const {gameName, setGameName} = useDeathTracker();

  const processGameName = (e) => {
    setGameName(e.target.value);
  }

  return (
    <Container sx={{paddingBottom: 2, paddingX: 2}}>

          <Grid container justifyContent="space-between" alignItems="center" sx={{backgroundColor: offsetHexColor(theme.palette.background.paper, 20), padding: 2, borderRadius: 5}}>
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


    </Container>
  )
}

export default DeathPageHeader
