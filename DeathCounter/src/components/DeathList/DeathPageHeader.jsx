import { Container, Grid, Typography } from "@mui/material"

import ClearButton from "../Buttons/ClearButton"
import ExportButton from "../Buttons/ExportButton"
import ImportButton from "../Buttons/ImportButton"

const DeathPageHeader = ({deaths}) => {
  return (
    <Container sx={{paddingBottom: 2, paddingX: 2}}>
      <Grid container alignItems="center" justifyContent="space-around">
        <Grid item>
          <Typography>
            Total Deaths: {deaths.reduce((total, currentItem) => total + currentItem.deaths, 0)}
          </Typography>
        </Grid>
        <Grid item>
          <ClearButton/>
          <ImportButton/>
          <ExportButton/>
        </Grid>
      </Grid>
    </Container>
  )
}

export default DeathPageHeader
