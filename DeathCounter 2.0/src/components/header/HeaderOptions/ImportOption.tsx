import HeaderMenuOption from "./HeaderMenuOption";
import { QueryStats } from "@mui/icons-material";
import { useModalProvider } from "../../../context/ModalContext";

const ImportOption = () => {
  const {toggleImportModal} = useModalProvider();
  return (
    <HeaderMenuOption icon={<QueryStats/>} text="Import Game" onClick={toggleImportModal}/>
  )
}

export default ImportOption
