import { Box, Grid, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

interface SharedListStatsProps {
  totalDeaths: number;
  totalEntities: number;
}

const SharedListStats = ({ totalDeaths, totalEntities }: SharedListStatsProps) => {
  return (
    <Box sx={{ mt: 3, mb: 3, width: { xs: "90%", sm: "500px" }, mx: "auto" }}>
      <Box sx={{ backgroundColor: grey[800], padding: "10px", borderRadius: 3 }}>
        <Typography variant="h5" color="textSecondary">
          Stats
        </Typography>
        <Grid container sx={{ marginTop: "10px", flexDirection: "column" }}>
          <Grid>
            <Typography>Total Bosses: {totalEntities}</Typography>
          </Grid>
          <Grid>
            <Typography>Total Deaths: {totalDeaths}</Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SharedListStats;
