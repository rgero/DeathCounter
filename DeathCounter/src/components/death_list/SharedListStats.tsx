import { Box } from "@mui/material";
import StatsCard from "@components/stats/StatsCard";
import { DeathList } from "@interfaces/DeathList";

interface SharedListStatsProps {
  deathList: DeathList;
}

const SharedListStats = ({ deathList }: SharedListStatsProps) => {
  return (
    <Box sx={{ mt: 3, mb: 3, width: { xs: "90%", sm: "500px" }, mx: "auto" }}>
      <StatsCard deathList={deathList} />
    </Box>
  );
};

export default SharedListStats;
