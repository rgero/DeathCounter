import { Add } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { useModalProvider } from "../../context/modal/ModalContext";

const CreateNewButton = () => {
  const {toggleCreateNewModal} = useModalProvider();
  return (
    <IconButton
      onClick={toggleCreateNewModal}
    >
      <Add/>
    </IconButton>
  )
}

export default CreateNewButton
