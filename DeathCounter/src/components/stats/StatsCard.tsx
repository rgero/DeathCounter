import { Box, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { DeathList } from "@interfaces/DeathList";

interface StatsCardProps {
  deathList: DeathList | null | undefined;
}

const StatsCard = ({ deathList }: StatsCardProps) => {
  const totalEntities = deathList?.entityList.length || 0;
  const totalDeaths = deathList?.entityList.reduce((acc, entity) => acc + (entity.deaths || 0), 0) || 0;
  return (
    <Box sx={{ backgroundColor: grey[800], padding: "10px", borderRadius: 3 }}>
      <Typography variant="h5" color="textSecondary">Stats</Typography>
      <Stack sx={{ marginTop: "10px" }}>
        <Typography>Total Bosses: {totalEntities}</Typography>
        <Typography>Total Deaths: {totalDeaths}</Typography>
      </Stack>
    </Box>
  );
};

export default StatsCard;
