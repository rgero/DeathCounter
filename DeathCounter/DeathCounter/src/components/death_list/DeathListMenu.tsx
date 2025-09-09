import {Divider, Menu} from "@mui/material";

import ChangeGameOption from "./deathlist_menu_options/ChangeGameOption";
import RemoveListOption from "./deathlist_menu_options/RemoveListOption";
import ToggleCreateNewOption from "./deathlist_menu_options/ToggleCreateNewOption";
import ToggleExportOption from "./deathlist_menu_options/ToggleExportOption";
import ToggleTokenOption from "./deathlist_menu_options/ToggleTokenDialogOption";
import { useIsMobile } from "../../hooks/useIsMobile";

interface Props
{
  anchorEl: HTMLElement | null,
  closeFn: () => void
}

const DeathListMenu: React.FC<Props> = ({anchorEl, closeFn}) => {
  const isOpen = Boolean(anchorEl);
  const isMobile = useIsMobile()
  
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
        {isMobile && <ChangeGameOption/>}
        <ToggleExportOption/>
        <Divider/>
        <RemoveListOption/>
      </Menu>
    </>
  );
}

export default DeathListMenu
