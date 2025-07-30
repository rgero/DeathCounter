import { Create } from "@mui/icons-material";
import MenuOption from "../../../interfaces/MenuOption";
import { useModalProvider } from "../../../context/modal/ModalContext";

const ToggleCreateNewOption = () => {
  const {toggleCreateNewModal} = useModalProvider();
  return (
    <MenuOption icon={<Create/>} text="Create" onClick={toggleCreateNewModal}/>
  )
}

export default ToggleCreateNewOption
