import { Grid, Typography } from "@mui/material"

const DeathListHeader = () => {
  return (
    <Grid container item direction="row" justifyContent="space-between">
      <Grid item>
        <Typography variant="h5">Name</Typography>
      </Grid>
      <Grid item>
        <Typography variant="h5">Deaths</Typography>
      </Grid>
    </Grid>
  )
}

export default DeathListHeader
