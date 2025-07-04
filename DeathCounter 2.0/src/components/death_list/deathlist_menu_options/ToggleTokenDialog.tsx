import { Key } from "@mui/icons-material";
import MenuOption from "../../../interfaces/MenuOption";
import { useModalProvider } from "../../../context/ModalContext";

const ToggleTokenOption = () => {
  const {toggleTokenModal} = useModalProvider();
  return (
    <MenuOption icon={<Key/>} text="Token" onClick={toggleTokenModal}/>
  )
}

export default ToggleTokenOption
