import { Container, Grid, Paper } from '@mui/material';

import DeathEntity from './DeathEntity';
import DeathListTableHeader from './DeathListTableHeader';
import { useDeathLists } from '../../context/deathCounter/DeathCounterContext';
import { useIsMobile } from '../../hooks/useIsMobile';

const DeathListTable = () => {
  const { activeDeathList } = useDeathLists();

  const isMobile = useIsMobile();

  if (!activeDeathList?.entityList || activeDeathList.entityList.length === 0) {
    return null;
  }

  return (
    <Container disableGutters>
      <Grid container spacing={2} direction="column">
        <Grid>
          <Paper sx={{
            p: 2,
            borderRadius: 5,
            width: isMobile ? "90%" : "500px",
            mx: "auto"
          }}>
            <DeathListTableHeader/>
            {activeDeathList.entityList
              .sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
              .map((item, index) => (
                <DeathEntity key={index} data={item} index={index} />
              ))
            }
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DeathListTable;
