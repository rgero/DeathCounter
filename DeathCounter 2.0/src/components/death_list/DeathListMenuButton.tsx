import DeathListMenu from "./DeathListMenu";
import { IconButton } from "@mui/material";
import { Settings } from "@mui/icons-material";
import { useState } from "react";

const DeathListMenuButton = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);


  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="death-list-menu"
        aria-controls="death-list-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <Settings/>
      </IconButton>
      <DeathListMenu anchorEl={anchorEl} closeFn={handleClose}/>
    </>  
  )
}

export default DeathListMenuButton
