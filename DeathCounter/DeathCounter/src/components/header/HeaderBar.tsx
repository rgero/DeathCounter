import { AppBar, Box, Grid, Typography } from "@mui/material"

import HeaderOptionsPanel from "./HeaderOptionsPanel";
import { Link } from "react-router-dom"
import { useIsMobile } from "../../hooks/useIsMobile";

const HeaderBar = () => {
  const isMobile = useIsMobile();
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
          backgroundColor: "transparent",
        }}
        elevation={0}
      >
        <Grid container justifyContent="space-between" alignItems="center" padding="0.25rem 0">
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
              <Typography variant={!isMobile ? "h4" : "h5"}>The Death Counter</Typography>
            </Link>
          </Grid>
          <HeaderOptionsPanel/>
        </Grid>
      </AppBar>
    </Box>
  )
}

export default HeaderBar
