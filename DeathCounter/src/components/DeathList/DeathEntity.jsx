import { Grid, Typography } from "@mui/material"

import React from "react";

const styles = {
  gridItem: {
    '&:hover': {
      background: "#f00",
    }
  }
}

const DeathEntity = ({data, processClick}) => {

  const handleClick = () => {
    processClick(data);
  }

  return (
    <>   
      <Grid item container direction="row" columnGap={5} onClick={handleClick} justifyContent="space-between" sx={styles.gridItem}>
        <Grid item>
          <Typography>
            {data.name}
          </Typography>
        </Grid>
        <Grid item>
          <Typography>
            {data.deaths}
          </Typography>
        </Grid>
      </Grid>
    </>
  )
}

export default DeathEntity
