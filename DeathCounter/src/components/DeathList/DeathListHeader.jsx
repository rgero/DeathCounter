import { Button, Container, Grid, Typography } from "@mui/material"

const DeathListHeader = ({deaths, clear}) => {
  return (
    <Container sx={{paddingBottom: 2}}>
      <Grid container alignItems="center" justifyContent="space-around">
        <Grid item>
          <Typography>
            Total Deaths: {deaths.reduce((total, currentItem) => total + currentItem.deaths, 0)}
          </Typography>
        </Grid>
        <Grid item>
          <Button onClick={clear}>Clear Deaths</Button>
        </Grid>
      </Grid>
    </Container>
  )
}

export default DeathListHeader
