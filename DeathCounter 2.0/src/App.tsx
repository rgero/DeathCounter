import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material"

import AppLayout from "./components/ui/AppLayout";
import LandingPage from "./pages/LandingPage";

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
      <ThemeProvider theme={darkTheme}>
          <CssBaseline/>
          <BrowserRouter>
            <Routes>
              <Route element={<AppLayout/>}>
                <Route index element={<Navigate replace to='login'/>}/>
              </Route>
              <Route path='login' element={<LandingPage/>} />
            </Routes>
          </BrowserRouter>
      </ThemeProvider>
  )
}

export default App
