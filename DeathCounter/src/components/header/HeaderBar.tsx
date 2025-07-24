import { AppBar, Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material"

import GameSelector from "../ui/GameSelector";
import { Link } from "react-router-dom"
import UserAvatar from "./UserAvatar";
import { useAuthenticationContext } from "../../context/AuthenticationContext";

const HeaderBar = () => {
  const {user} = useAuthenticationContext();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        position: "relative",
        backgroundImage: 'url("/Header.svg")',
        backgroundRepeat: 'repeat-x',
      }}
    >
      <AppBar position="static" 
        sx={{ 
          px: 2, 
          padding: "0.5rem",
          backgroundColor: "transparent",
        }}
        elevation={0}
      >
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid>
            <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "inherit" }}>
              <Box sx={{
                width: { xs: "24px", md: "32px" },
                height: { xs: "24px", md: "32px" },
                marginRight: "0.5rem"
              }}>
                <img 
                  src="/logo.svg" 
                  alt="Death Counter" 
                  style={{ width: "100%", height: "100%" }} // Ensure img fills the Box
                />
              </Box>
              <Typography variant="h5">The Death Counter</Typography>
            </Link>
          </Grid>
          {user && (
            <Grid container alignItems="center" justifyContent="flex-end" spacing={2}>
              {!isMobile && (<Grid>
                <GameSelector/>
              </Grid>)}
              <Grid>
                <UserAvatar />
              </Grid>
            </Grid>
          )}
        </Grid>
      </AppBar>
    </Box>
  )
}

export default HeaderBar
