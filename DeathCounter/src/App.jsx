import { BrowserRouter, Route, Routes } from "react-router-dom"
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material"

import AppLayout from "./components/ui/AppLayout";
import DeathPage from "./page/DeathPage"
import { DeathTrackerProvider } from "./context/DeathTrackerContext";
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
          <CssBaseline/>
          <BrowserRouter>
            <Routes>
              <Route element={<AppLayout/>}>
                <Route index element={<DeathPage/>}/>
              </Route>
            </Routes>
          </BrowserRouter>
        </DeathTrackerProvider>
      </ThemeProvider>
    </SocketProvider>
  )
}

export default App
