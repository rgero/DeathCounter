import { Container, Paper, Typography, Grid, useTheme } from "@mui/material";
import { Entity } from "@interfaces/Entity";

interface SharedEntityTableProps {
  entities: Entity[];
}

const SharedEntityTable = ({ entities }: SharedEntityTableProps) => {
  const theme = useTheme();

  if (!entities || entities.length === 0) {
    return (
      <Typography variant="body1" sx={{ textAlign: "center", py: 3 }}>
        No entities in this death list.
      </Typography>
    );
  }

  return (
    <Container disableGutters>
      <Paper
        sx={{
          p: 2,
          borderRadius: 5,
          width: { xs: "90%", sm: "500px" },
          mx: "auto",
        }}
      >
        <Grid
          container
          sx={{
            flexDirection: "row",
            justifyContent: "space-between",
            px: 1,
            py: 0.5,
            fontWeight: "bold",
            borderBottom: `1px solid ${theme.palette.divider}`,
            mb: 1,
          }}
        >
          <Grid size={10}>
            <Typography sx={{ fontWeight: "bold" }}>Name</Typography>
          </Grid>
          <Grid size={2}>
            <Typography sx={{ fontWeight: "bold", textAlign: "right" }}>
              Deaths
            </Typography>
          </Grid>
        </Grid>

        {entities
          .sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
          .map((item, index) => (
            <Grid
              key={item.id ?? index}
              container
              sx={{
                flexDirection: "row",
                justifyContent: "space-between",
                px: 1,
                py: 0.5,
                backgroundColor:
                  index % 2 === 0 ? "transparent" : theme.palette.grey[900],
              }}
            >
              <Grid size={10}>
                <Typography>{item.name}</Typography>
              </Grid>
              <Grid size={2}>
                <Typography sx={{ textAlign: "right" }}>
                  {item.deaths}
                </Typography>
              </Grid>
            </Grid>
          ))}
      </Paper>
    </Container>
  );
};

export default SharedEntityTable;
