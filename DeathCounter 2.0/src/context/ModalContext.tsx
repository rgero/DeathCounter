import React, { createContext, useContext, useState } from "react";

import ImportModal from "../components/modals/ImportModal";
import TokenModal from "../components/modals/TokenModal";

interface ModalContextProps {
  importModalOpen: boolean;
  tokenModalOpen: boolean;
  toggleImportModal: () => void;
  toggleTokenModal: () => void;
}

const ModalContext = createContext<ModalContextProps|undefined>(undefined);

const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [importModalOpen, setImportModal] = useState(false);
  const [tokenModalOpen, setTokenModalOpen] = useState(false);

  const toggleTokenModal = () => setTokenModalOpen(prev => !prev);

  const toggleImportModal = () => setImportModal(prev => !prev);

  return (
    <ModalContext.Provider value={{ 
      importModalOpen,
      tokenModalOpen, 
      toggleImportModal,
      toggleTokenModal
    }}>
      <ImportModal/>
      <TokenModal/>
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
