import { Grid, Typography } from "@mui/material"

const DeathListTableHeader = () => {
  return (
    <Grid container direction="row" justifyContent="space-between">
      <Grid>
        <Typography variant="h5">Name</Typography>
      </Grid>
      <Grid>
        <Typography variant="h5">Deaths</Typography>
      </Grid>
    </Grid>
  )
}

export default DeathListTableHeader
