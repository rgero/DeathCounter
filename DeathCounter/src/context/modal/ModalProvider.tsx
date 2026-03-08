import React, { useState } from "react";

import CreateNewModal from '@components/modals/CreateNewModal';
import DeleteListModal from '@components/modals/DeleteListModal';
import ExportModal from '@components/modals/ExportModal';
import FeedbackModal from '@components/modals/FeedbackModal';
import ImportModal from '@components/modals/ImportModal';
import { ModalContext } from "./ModalContext";
import SwitchGameModal from '@components/modals/SwitchGameModal';
import TokenModal from '@components/modals/TokenModal';

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [createNewModalOpen, setCreateNewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [importModalOpen, setImportModal] = useState(false);
  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [switchGameModalOpen, setSwitchGameModalOpen] = useState(false);

  const toggleTokenModal = () => setTokenModalOpen((prev) => !prev);
  const toggleDeleteModal = () => setDeleteModalOpen((prev) => !prev);
  const toggleImportModal = () => setImportModal((prev) => !prev);
  const toggleExportModal = () => setExportModalOpen((prev) => !prev);
  const toggleFeedbackOpen = () => setFeedbackModalOpen((prev) => !prev);
  const toggleCreateNewModal = () => setCreateNewModalOpen((prev) => !prev);
  const toggleSwitchGameModal = () => setSwitchGameModalOpen((prev) => !prev);


  return (
    <ModalContext.Provider
      value={{
        createNewModalOpen,
        deleteModalOpen,
        exportModalOpen,
        feedbackModalOpen,
        importModalOpen,
        switchGameModalOpen,
        tokenModalOpen,
        toggleCreateNewModal,
        toggleDeleteModal,
        toggleExportModal,
        toggleFeedbackOpen,
        toggleImportModal,
        toggleSwitchGameModal,
        toggleTokenModal,

      }}
    >
      <CreateNewModal />
      <ImportModal />
      <TokenModal />
      <DeleteListModal />
      <ExportModal />
      <FeedbackModal/>
      <SwitchGameModal />
      {children}
    </ModalContext.Provider>
  );
};
