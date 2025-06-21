import { createContext, useContext, useState } from "react";

import ClearModal from "../components/Modals/ClearModal";
import DeleteModal from "../components/Modals/DeleteModal";
import ImportModal from "../components/Modals/ImportModal";

const DialogContext = createContext();

const DialogProvider = ({ children }) => {
  const [clearDialog, setClearDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [importDialog, setImportDialog] = useState(false);

  const toggleClearDialog = () => setClearDialog(prev => !prev);
  const toggleDeleteDialog = () => setDeleteDialog(prev => !prev);
  const toggleImportDialog = () => setImportDialog(prev => !prev);

  return (
    <DialogContext.Provider value={{ 
      clearDialog, 
      toggleClearDialog, 
      deleteDialog, 
      toggleDeleteDialog, 
      importDialog, 
      toggleImportDialog
    }}>
      <ClearModal open={clearDialog} />
      <DeleteModal open={deleteDialog} />
      <ImportModal open={importDialog} />
      {children}
    </DialogContext.Provider>
  )
}

const useDialogProvider = () => {
  const context = useContext(DialogContext);
  if (context === undefined) throw new Error("Dialog Context was used outside of Dialog Provider");
  return context;
}

export { DialogProvider, useDialogProvider };
