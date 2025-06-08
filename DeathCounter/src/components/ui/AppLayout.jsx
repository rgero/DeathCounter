import { Container, Typography } from "@mui/material"

import { Outlet } from "react-router-dom"
import { isMobile } from "../../utils/isMobile"

const AppLayout = () => {
  return (
    <>
      <Container disableGutters
        maxWidth={false}
        sx={{
          backgroundImage: `url('Header.svg')`,
          backgroundRepeat: 'repeat-x',
          paddingBottom: isMobile() ? 4 : 2
        }}
      >
        <Container>
          <Typography variant={isMobile() ? "h4" : "h3"}>The Death Count</Typography>
        </Container>
      </Container>
      <Container disableGutters>
        <Outlet/>
      </Container>

    </>
  )
}

export default AppLayout
