import { Box, Divider, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { DeathList } from "@interfaces/DeathList";

interface StatsCardProps {
  deathList: DeathList | null | undefined;
}

const StatRow = ({ label, value }: { label: string; value: string | number }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <Typography variant="body2" sx={{ fontWeight: "bold" }} color="textSecondary">{label}</Typography>
    <Typography variant="body1">{value}</Typography>
  </Box>
);

const StatsCard = ({ deathList }: StatsCardProps) => {
  const entities = deathList?.entityList ?? [];
  const totalEntities = entities.length;
  const totalDeaths = entities.reduce((acc, entity) => acc + (entity.deaths || 0), 0);
  const avgDeaths = totalEntities > 0 ? (totalDeaths / totalEntities).toFixed(1) : 0;
  const hardestBoss = entities.length > 0 ? entities.reduce((prev, curr) => (curr.deaths > prev.deaths ? curr : prev)) : null;
  const deathlessBosses = entities.filter((e) => e.deaths === 0).length;

  return (
    <Box sx={{ backgroundColor: grey[800], padding: "16px", borderRadius: 3 }}>
      <Typography variant="h5" color="textSecondary" sx={{ mb: 1, fontWeight: "bold" }}>Stats</Typography>
      <Divider sx={{ mb: 1 }} />
      <Stack spacing={1}>
        <StatRow label="Total Bosses" value={totalEntities} />
        <StatRow label="Total Deaths" value={totalDeaths} />
        <StatRow label="Avg Deaths per Boss" value={avgDeaths} />
        <StatRow label="Hardest Boss" value={hardestBoss ? `${hardestBoss.name} (${hardestBoss.deaths})` : "—"} />
        <StatRow label="Deathless Bosses" value={deathlessBosses} />
      </Stack>
    </Box>
  );
};

export default StatsCard;
