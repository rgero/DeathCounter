import { createContext, useContext } from "react";

export interface ModalContextProps {
  createNewModalOpen: boolean;
  deleteModalOpen: boolean;
  exportModalOpen: boolean;
  importModalOpen: boolean;
  tokenModalOpen: boolean;
  toggleCreateNewModal: () => void;
  toggleDeleteModal: () => void;
  toggleExportModal: () => void;
  toggleImportModal: () => void;
  toggleTokenModal: () => void;
}

export const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const useModalProvider = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("ModalContext was used outside of ModalProvider");
  }
  return context;
};
