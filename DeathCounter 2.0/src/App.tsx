import { BrowserRouter, Route, Routes } from "react-router-dom"
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AppLayout from "./components/ui/AppLayout";
import AuthenticatedRoute from "./components/AuthenicatedRoute";
import { AuthenticationProvider } from "./context/AuthenticationContext";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";
import PageNotFound from "./pages/PageNotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 1000,
    },
    mutations: {
      onError: (error) => {
        console.error(error);
      },
    },
  },
});

const App = () => {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline/>
        <QueryClientProvider client={queryClient}>
          <AuthenticationProvider>
            <BrowserRouter>
              <Routes>
                <Route
                  element={
                    <AuthenticatedRoute>
                      <AppLayout />
                    </AuthenticatedRoute>
                  }
                >
                  <Route index element={<DashboardPage/>}/>
                </Route>
                <Route path='landing' element={<LandingPage/>} />
                <Route element={<AppLayout/>}>
                  <Route path="*" element={<PageNotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </AuthenticationProvider>
        </QueryClientProvider>
      </ThemeProvider>
  )
}

export default App
