import { BrowserRouter, Route, Routes } from "react-router-dom"

import DeathPage from "./page/DeathPage"
import { SocketProvider } from "./context/WebSocketContext"

function App() {
  return (
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<DeathPage/>}/>
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  )
}

export default App
