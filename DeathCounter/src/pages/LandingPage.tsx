import { Button, Card, CardContent, Grid, Theme, Typography, useTheme } from "@mui/material";

import { useAuthenticationContext } from '@context/authentication/AuthenticationContext';
import { useEffect } from "react";
import { useIsMobile } from '@hooks/useIsMobile';

const LandingPage = () => {
  const theme: Theme = useTheme();
  const isMobile = useIsMobile();

  const {loginWithGoogle} = useAuthenticationContext();

  useEffect(() => {
    document.body.style.background = `url('/background.jpeg') center/cover no-repeat fixed`;
    document.body.style.backgroundColor = theme.palette.background.paper;
    document.body.style.color = theme.palette.primary.light;

    return () => {
      document.body.style.background = "";
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    };
  }, [theme]);

  return (
    <Grid
      container
      sx={{
        height: "100vh",
        pl: isMobile ? 0 : "15%",
        alignItems: "center",
        justifyContent: isMobile ? "center" : "flex-start",
      }}
    >
      <Card sx={{padding: "10px"}}>
        <CardContent>
          <Grid container spacing={2} sx={{ flexDirection: "column" }}>
            <Grid>
              <Typography variant="h5">The Death Counter</Typography>
            </Grid>
            <Grid sx={{ alignItems: "center" }}>
              <Typography>Want to keep track of how often you die in games? Use this!</Typography>
            </Grid>
            <Grid container sx={{ justifyContent: "flex-end" }}>
              <Button variant="contained" color="primary" onClick={loginWithGoogle}>Login</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default LandingPage;
