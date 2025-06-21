import { BrowserRouter, Route, Routes } from "react-router-dom"
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material"

import AppLayout from "./components/ui/AppLayout";
import DeathPage from "./page/DeathPage"
import { DeathTrackerProvider } from "./context/DeathTrackerContext";
import { DialogProvider } from "./context/DialogContext";
import { SocketProvider } from "./context/WebSocketContext"

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <SocketProvider>
      <ThemeProvider theme={darkTheme}>
        <DeathTrackerProvider>
          <DialogProvider>
            <CssBaseline/>
            <BrowserRouter>
              <Routes>
                <Route element={<AppLayout/>}>
                  <Route index element={<DeathPage/>}/>
                </Route>
              </Routes>
            </BrowserRouter>
          </DialogProvider>
        </DeathTrackerProvider>
      </ThemeProvider>
    </SocketProvider>
  )
}

export default App
