import { Grid } from "@mui/material"

const DeathEntity = ({children}) => {
  return (
    <Grid container>
      <Grid item>
        {children.name}  
      </Grid>
      <Grid item>
        {children.deaths}
      </Grid>
    </Grid>
  )
}

export default DeathEntity
