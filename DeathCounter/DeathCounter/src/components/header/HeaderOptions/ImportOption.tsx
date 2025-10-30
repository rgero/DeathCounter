import { ImportExport } from "@mui/icons-material";
import MenuOption from '@interfaces/MenuOption';
import { useModalProvider } from '@context/modal/ModalContext';

const ImportOption = () => {
  const {toggleImportModal} = useModalProvider();
  return (
    <MenuOption icon={<ImportExport/>} text="Import Game" onClick={toggleImportModal}/>
  )
}

export default ImportOption
