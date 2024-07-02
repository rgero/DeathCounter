import { BrowserRouter, Route, Routes } from "react-router-dom"
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material"

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
            <Route index element={<DeathPage/>}/>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </SocketProvider>
  )
}

export default App
