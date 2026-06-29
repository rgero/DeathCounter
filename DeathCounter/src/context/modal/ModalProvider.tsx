import React, { useState } from "react";

import CreateNewModal from '@components/modals/CreateNewModal';
import DeleteListModal from '@components/modals/DeleteListModal';
import ExportModal from '@components/modals/ExportModal';
import FeedbackModal from '@components/modals/FeedbackModal';
import ImportModal from '@components/modals/ImportModal';
import { ModalContext } from "./ModalContext";
import SwitchGameModal from '@components/modals/SwitchGameModal';
import TokenModal from '@components/modals/TokenModal';
import ShareListModal from '@components/modals/ShareListModal';
import { useDeathLists } from '../deathCounter/DeathCounterContext';

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [createNewModalOpen, setCreateNewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [importModalOpen, setImportModal] = useState(false);
  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [switchGameModalOpen, setSwitchGameModalOpen] = useState(false);
  const [shareListModalOpen, setShareListModalOpen] = useState(false);
  
  const { activeDeathList } = useDeathLists();

  const toggleTokenModal = () => setTokenModalOpen((prev) => !prev);
  const toggleDeleteModal = () => setDeleteModalOpen((prev) => !prev);
  const toggleImportModal = () => setImportModal((prev) => !prev);
  const toggleExportModal = () => setExportModalOpen((prev) => !prev);
  const toggleFeedbackOpen = () => setFeedbackModalOpen((prev) => !prev);
  const toggleCreateNewModal = () => setCreateNewModalOpen((prev) => !prev);
  const toggleSwitchGameModal = () => setSwitchGameModalOpen((prev) => !prev);
  const toggleShareListModal = () => setShareListModalOpen((prev) => !prev);


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
        shareListModalOpen,
        toggleCreateNewModal,
        toggleDeleteModal,
        toggleExportModal,
        toggleFeedbackOpen,
        toggleImportModal,
        toggleSwitchGameModal,
        toggleTokenModal,
        toggleShareListModal,
      }}
    >
      <CreateNewModal />
      <ImportModal />
      <TokenModal />
      <DeleteListModal />
      <ExportModal />
      <FeedbackModal/>
      <SwitchGameModal />
      <ShareListModal open={shareListModalOpen} onClose={toggleShareListModal} shareToken={activeDeathList?.token} />
      {children}
    </ModalContext.Provider>
  );
};
