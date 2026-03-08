import BaseModal from "./BaseModal"
import FeedbackForm from "../feedback/FeedbackForm";
import { useModalProvider } from '@context/modal/ModalContext';

const FeedbackModal = () => {
  const {feedbackModalOpen, toggleFeedbackOpen} = useModalProvider();
  return (
    <BaseModal
      open={feedbackModalOpen}
      handleClose={toggleFeedbackOpen}
      label="feedback"
    >
      <FeedbackForm/>
    </BaseModal>
  )
}

export default FeedbackModal
