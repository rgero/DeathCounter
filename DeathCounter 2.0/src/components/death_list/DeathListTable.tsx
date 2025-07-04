import { Container, Grid, Paper, useMediaQuery, useTheme } from '@mui/material';

import DeathEntity from './DeathEntity';
import DeathListTableHeader from './DeathListTableHeader';
import { useDeathLists } from '../../context/DeathCounterContext';

const DeathListTable = () => {
  const { getCurrentlyActiveDeathList } = useDeathLists();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const deathList = getCurrentlyActiveDeathList();

  if (!deathList) {
    return null;
  }

  return (
    <Container disableGutters>
      <Grid container spacing={2} direction="column">
        {deathList.entityList.sort((a,b) => a.id - b.id).length > 0 ? (
          <Grid>
            <Paper sx={
              {
                p: 2,
                borderRadius: 5,
                width: isMobile ? "90%" : "500px",
                mx: "auto"
              }
            }>
              <DeathListTableHeader/>
              {
                deathList.entityList.map( (item, index) => (
                  <DeathEntity key={index} data={item} index={index} />
                ))
              }
            </Paper>
          </Grid>
        ) : (null)}
      </Grid>
    </Container>
  )
}

export default DeathListTable
