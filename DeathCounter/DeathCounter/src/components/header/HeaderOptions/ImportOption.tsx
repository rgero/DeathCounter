import MenuOption from "../../../interfaces/MenuOption";
import { QueryStats } from "@mui/icons-material";
import { useModalProvider } from "../../../context/modal/ModalContext";

const ImportOption = () => {
  const {toggleImportModal} = useModalProvider();
  return (
    <MenuOption icon={<QueryStats/>} text="Import Game" onClick={toggleImportModal}/>
  )
}

export default ImportOption
