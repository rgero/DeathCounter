import { CircularProgress, Container, Grid } from "@mui/material"

const Loading = () => {
  return (
    <Container disableGutters>
      <Grid container sx={{ height: "100vh", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Grid>
    </Container>
  )
}

export default Loading
