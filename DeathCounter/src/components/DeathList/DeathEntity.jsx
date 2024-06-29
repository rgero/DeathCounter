import { Grid, Typography } from "@mui/material"

const DeathEntity = ({children}) => {
  return (
    <Grid container spacing={5}>
      <Grid item>
        <Typography variant="h5">
          {children.name}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="h5">
          {children.deaths}
        </Typography>
      </Grid>
    </Grid>
  )
}

export default DeathEntity
