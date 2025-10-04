import { FileDownload } from "@mui/icons-material";
import MenuOption from "../../../interfaces/MenuOption";
import { useModalProvider } from "../../../context/modal/ModalContext";

const ToggleExportOption = () => {
  const {toggleExportModal} = useModalProvider();
  return (
    <MenuOption icon={<FileDownload/>} text="Export" onClick={toggleExportModal}/>
  )
}

export default ToggleExportOption
