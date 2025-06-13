import { Container, Typography, useMediaQuery, useTheme } from "@mui/material"

import { Outlet } from "react-router-dom"

const AppLayout = () => {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <Container disableGutters
      maxWidth={false}
      sx={{
        backgroundImage: `url('Header.svg')`,
        backgroundRepeat: 'repeat-x',
        paddingBottom: isMobile ? 4 : 2
      }}
    >
      <Container>
        <Typography variant={isMobile ? "h4" : "h3"}>The Death Count</Typography>
      </Container>
      <Outlet/>
    </Container>
  )
}

export default AppLayout
