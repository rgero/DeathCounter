import {Divider, Menu} from "@mui/material";

import RemoveListOption from "./deathlist_menu_options/RemoveListOption";
import ToggleCreateNewOption from "./deathlist_menu_options/ToggleCreateNewOption";
import ToggleExportOption from "./deathlist_menu_options/ToggleExportOption";
import ToggleTokenOption from "./deathlist_menu_options/ToggleTokenDialogOption";

interface Props
{
  anchorEl: HTMLElement | null,
  closeFn: () => void
}

const DeathListMenu: React.FC<Props> = ({anchorEl, closeFn}) => {
  const isOpen = Boolean(anchorEl);
  
  return (
    <>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={isOpen}
        onClose={closeFn}
        onClick={closeFn}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <ToggleCreateNewOption/>
        <ToggleTokenOption/>
        <ToggleExportOption/>
        <Divider/>
        <RemoveListOption/>
      </Menu>
    </>
  );
}

export default DeathListMenu
