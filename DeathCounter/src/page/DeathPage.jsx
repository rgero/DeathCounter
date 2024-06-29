import { Container, Typography } from "@mui/material";

import DeathList from "../components/DeathList/DeathList";

const DeathPage = () => {
  return (
    <Container>
      <Typography variant="h3">The Death Count</Typography>
      <hr/>
      <DeathList/>
    </Container>
  )
}

export default DeathPage
