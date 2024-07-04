import { BrowserRouter, Route, Routes } from "react-router-dom"
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material"

import AppLayout from "./components/AppLayout";
import DeathPage from "./page/DeathPage"
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
        <CssBaseline/>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout/>}>
              <Route index element={<DeathPage/>}/>
            </Route>

          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </SocketProvider>
  )
}

export default App
