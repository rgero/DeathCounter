import { Button, Card, CardContent, Grid, Typography } from "@mui/material";

import { useAuthenticationContext } from "../context/AuthenticationContext";

const LandingPage = () => {
  const {loginWithGoogle} = useAuthenticationContext();
  return (
    <Grid
      container
      sx={{ 
        height: "100vh"
      }}
      alignItems="center"
      justifyContent="center"
    >
      <Card sx={{padding: "10px"}}>
        <CardContent>
          <Grid container direction="column" spacing={2}>
            <Grid>
              <Typography variant="h5">The Death Counter</Typography>
            </Grid>
            <Grid alignItems="center">
              <Typography>Want to keep track of how often you die in games? Use this!</Typography>
            </Grid>
            <Grid container justifyContent="flex-end">
              <Button variant="contained" color="primary" onClick={loginWithGoogle}>Login</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default LandingPage;
