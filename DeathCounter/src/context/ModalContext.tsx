import React, { createContext, useContext, useState } from "react";

import DeleteListModal from "../components/modals/DeleteListModal";
import ImportModal from "../components/modals/ImportModal";
import TokenModal from "../components/modals/TokenModal";

interface ModalContextProps {
  deleteModalOpen: boolean;
  importModalOpen: boolean;
  tokenModalOpen: boolean;
  toggleDeleteModal: () => void;
  toggleImportModal: () => void;
  toggleTokenModal: () => void;
}

const ModalContext = createContext<ModalContextProps|undefined>(undefined);

const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [importModalOpen, setImportModal] = useState(false);
  const [tokenModalOpen, setTokenModalOpen] = useState(false);

  const toggleTokenModal = () => setTokenModalOpen(prev => !prev);
  const toggleImportModal = () => setImportModal(prev => !prev);
  const toggleDeleteModal = () => setDeleteModalOpen(prev => !prev);

  return (
    <ModalContext.Provider value={{ 
      deleteModalOpen,
      importModalOpen,
      tokenModalOpen, 
      toggleDeleteModal,
      toggleImportModal,
      toggleTokenModal
    }}>
      <ImportModal/>
      <TokenModal/>
      <DeleteListModal/>
      {children}
    </ModalContext.Provider>
  )
}

const useModalProvider = () => {
  const context = useContext(ModalContext);
  if (context === undefined) throw new Error("Modal Context was used outside of Modal Provider");
  return context;
}

export { ModalProvider, useModalProvider };
