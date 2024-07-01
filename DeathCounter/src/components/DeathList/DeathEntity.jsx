import { Grid, Modal, Typography } from "@mui/material"
import DeathEntityModal from "./DeathEntityModal";
import React from "react";

const styles = {
  gridItem: {
    '&:hover': {
      background: "#f00",
    }
  }
}

const DeathEntity = ({data, editFn}) => {
  const [isOpen, setModalOpen] = React.useState(false);

  const handleClick = () => {
    setModalOpen(true);
  }

  const closeModal = () => {
    setModalOpen(false);
  }
  
  return (
    <>
      <DeathEntityModal editFn={editFn} closeFn={closeModal} isOpen={isOpen} targetItem={data}/>     
      <Grid item container direction="row" columnGap={5} onClick={handleClick} justifyContent="space-between" sx={styles.gridItem}>
        <Grid item>
          <Typography variant="h5">
            {data.name}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h5">
            {data.deaths}
          </Typography>
        </Grid>
      </Grid>
    </>
  )
}

export default DeathEntity
