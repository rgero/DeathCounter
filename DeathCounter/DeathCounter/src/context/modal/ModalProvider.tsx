import React, { useState } from "react";

import CreateNewModal from "../../components/modals/CreateNewModal";
import DeleteListModal from "../../components/modals/DeleteListModal";
import ExportModal from "../../components/modals/ExportModal";
import ImportModal from "../../components/modals/ImportModal";
import { ModalContext } from "./ModalContext";
import TokenModal from "../../components/modals/TokenModal";

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [createNewModalOpen, setCreateNewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [importModalOpen, setImportModal] = useState(false);
  const [tokenModalOpen, setTokenModalOpen] = useState(false);

  const toggleTokenModal = () => setTokenModalOpen((prev) => !prev);
  const toggleImportModal = () => setImportModal((prev) => !prev);
  const toggleExportModal = () => setExportModalOpen((prev) => !prev);
  const toggleDeleteModal = () => setDeleteModalOpen((prev) => !prev);
  const toggleCreateNewModal = () => setCreateNewModalOpen((prev) => !prev);

  return (
    <ModalContext.Provider
      value={{
        createNewModalOpen,
        deleteModalOpen,
        exportModalOpen,
        importModalOpen,
        tokenModalOpen,
        toggleCreateNewModal,
        toggleDeleteModal,
        toggleExportModal,
        toggleImportModal,
        toggleTokenModal,
      }}
    >
      <CreateNewModal />
      <ImportModal />
      <TokenModal />
      <DeleteListModal />
      <ExportModal />

      {children}
    </ModalContext.Provider>
  );
};
