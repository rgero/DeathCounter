import {Divider, Menu} from "@mui/material";

import ChangeGameOption from "./options/ChangeGameOption";
import RemoveListOption from "./options/RemoveListOption";
import ToggleExportOption from "./options/ToggleExportOption";
import ToggleTokenOption from "./options/ToggleTokenDialogOption";
import { useIsMobile } from "../../hooks/useIsMobile";

interface Props
{
  anchorEl: HTMLElement | null,
  closeFn: () => void
}

const GameMenu: React.FC<Props> = ({anchorEl, closeFn}) => {
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
        <ToggleTokenOption/>
        {isMobile && <ChangeGameOption/>}
        <ToggleExportOption/>
        <Divider/>
        <RemoveListOption/>
      </Menu>
    </>
  );
}

export default GameMenu
