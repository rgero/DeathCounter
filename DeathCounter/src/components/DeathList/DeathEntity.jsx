import { Grid, Typography } from "@mui/material"

const styles = {
  gridItem: {
    '&:hover': {
      background: "#f00",
    }
  }
}

const DeathEntity = ({children}) => {
  const handleClick = () => {
    alert(`Hello ${children.name}`)
  }
  
  return (
    <Grid container direction="row" columnGap={5} onClick={handleClick} justifyContent="center" sx={styles.gridItem} border={1}>
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
