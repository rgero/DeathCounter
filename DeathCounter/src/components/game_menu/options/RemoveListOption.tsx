import { Delete } from "@mui/icons-material";
import MenuOption from '@interfaces/MenuOption';
import { useModalProvider } from '@context/modal/ModalContext';

const RemoveListOption = () => {
  const {toggleDeleteModal} = useModalProvider();

  return (
    <MenuOption icon={<Delete/>} text="Delete" onClick={toggleDeleteModal}/>
  )
}

export default RemoveListOption
