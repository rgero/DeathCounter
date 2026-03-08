import MenuOption from '@interfaces/MenuOption';
import { SwapHoriz } from "@mui/icons-material";
import { useModalProvider } from '@context/modal/ModalContext';

const ChangeGameOption = () => {
  const {toggleSwitchGameModal} = useModalProvider();
  return (
    <MenuOption icon={<SwapHoriz/>} text="Switch Games" onClick={toggleSwitchGameModal}/>
  )
}

export default ChangeGameOption
