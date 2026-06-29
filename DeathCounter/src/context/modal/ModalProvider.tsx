import React, { lazy, Suspense, useState } from "react";

import { ModalContext } from "./ModalContext";
import { useDeathLists } from '../deathCounter/DeathCounterContext';

const CreateNewModal = lazy(() => import('@components/modals/CreateNewModal'));
const DeleteListModal = lazy(() => import('@components/modals/DeleteListModal'));
const ExportModal = lazy(() => import('@components/modals/ExportModal'));
const FeedbackModal = lazy(() => import('@components/modals/FeedbackModal'));
const ImportModal = lazy(() => import('@components/modals/ImportModal'));
const SwitchGameModal = lazy(() => import('@components/modals/SwitchGameModal'));
const TokenModal = lazy(() => import('@components/modals/TokenModal'));
const ShareListModal = lazy(() => import('@components/modals/ShareListModal'));

const ModalSlot = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={null}>{children}</Suspense>
);

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
      {createNewModalOpen && (
        <ModalSlot>
          <CreateNewModal />
        </ModalSlot>
      )}
      {importModalOpen && (
        <ModalSlot>
          <ImportModal />
        </ModalSlot>
      )}
      {tokenModalOpen && (
        <ModalSlot>
          <TokenModal />
        </ModalSlot>
      )}
      {deleteModalOpen && (
        <ModalSlot>
          <DeleteListModal />
        </ModalSlot>
      )}
      {exportModalOpen && (
        <ModalSlot>
          <ExportModal />
        </ModalSlot>
      )}
      {feedbackModalOpen && (
        <ModalSlot>
          <FeedbackModal/>
        </ModalSlot>
      )}
      {switchGameModalOpen && (
        <ModalSlot>
          <SwitchGameModal />
        </ModalSlot>
      )}
      {shareListModalOpen && (
        <ModalSlot>
          <ShareListModal open={shareListModalOpen} onClose={toggleShareListModal} shareToken={activeDeathList?.token} />
        </ModalSlot>
      )}
      {children}
    </ModalContext.Provider>
  );
};
