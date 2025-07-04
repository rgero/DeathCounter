import MenuOption from "../../../interfaces/MenuOption";
import { QueryStats } from "@mui/icons-material";
import { useModalProvider } from "../../../context/ModalContext";

const ImportOption = () => {
  const {toggleImportModal} = useModalProvider();
  return (
    <MenuOption icon={<QueryStats/>} text="Import Game" onClick={toggleImportModal}/>
  )
}

export default ImportOption
