import { Container, Typography } from "@mui/material"

import { Outlet } from "react-router-dom"

const AppLayout = () => {
  return (
    <>
      <Container disableGutters
        maxWidth={false}
        sx={{
          backgroundImage: `url('Header.svg')`,
          backgroundRepeat: 'repeat-x',
          paddingBottom: 1
        }}
      >
        <Container>
          <Typography variant="h3">The Death Count</Typography>
        </Container>
      </Container>
      <Container>
        <Outlet/>
      </Container>

    </>
  )
}

export default AppLayout
