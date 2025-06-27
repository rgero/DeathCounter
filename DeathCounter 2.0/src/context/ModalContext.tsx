import React, { createContext, useContext, useState } from "react";

import ImportModal from "../components/modals/ImportModal";

interface ModalContextProps {
  importModal: boolean;
  toggleImportModal: () => void;
}

const ModalContext = createContext<ModalContextProps|undefined>(undefined);

const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [importModal, setImportModal] = useState(false);

  const toggleImportModal = () => setImportModal(prev => !prev);

  return (
    <ModalContext.Provider value={{ 
      importModal, 
      toggleImportModal
    }}>
      <ImportModal open={importModal} />
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
