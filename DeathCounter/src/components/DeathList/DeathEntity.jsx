import { Grid, Typography } from "@mui/material"

const styles = {
  gridItem: {
    '&:hover': {
      background: "#f00",
    }
  }
}

const DeathEntity = ({children}) => {
  return (
    <Grid container spacing={5} onClick={()=> alert(`Hello ${children.name}`)} sx={styles.gridItem}>
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
