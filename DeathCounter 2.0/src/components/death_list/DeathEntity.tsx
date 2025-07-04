import { Grid, Typography, useTheme } from "@mui/material"

const DeathEntity = ({index, data} : {index: number, data: {name: string, deaths: number}}) => {
  const theme = useTheme();
  const styles = {
    gridItem: {
      paddingX: 1,
      backgroundColor: index % 2 === 0 ? "" : theme.palette.grey[800]
    }
  }

  return (
    <Grid container direction="row" justifyContent="space-between" sx={styles.gridItem}>
      <Grid>
        <Typography>
          {data.name}
        </Typography>
      </Grid>
      <Grid>
        <Typography>
          {data.deaths}
        </Typography>
      </Grid>
    </Grid>
  )
}

export default DeathEntity
