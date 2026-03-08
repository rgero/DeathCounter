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
        height: "100vh"
      }}
      alignItems="center"
      justifyContent={isMobile ? "center" : "flex-start"}
      paddingLeft={isMobile ? 0 : "15%"}
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
