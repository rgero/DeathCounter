import { Feedback } from "@mui/icons-material";
import MenuOption from '@interfaces/MenuOption';
import { useModalProvider } from '@context/modal/ModalContext';

const FeedbackOption = () => {
  const {toggleFeedbackOpen} = useModalProvider();
  return (
    <MenuOption icon={<Feedback />} text="Log Feedback" onClick={toggleFeedbackOpen} />
  )
}

export default FeedbackOption
