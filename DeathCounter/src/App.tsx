import { BrowserRouter, Route, Routes } from "react-router-dom"
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AppLayout from '@components/ui/AppLayout';
import AuthenticatedRoute from '@components/AuthenicatedRoute';
import { AuthenticationProvider } from '@context/authentication/AuthenticationProvider';
import DashboardPage from '@pages/DashboardPage';
import { DeathListProvider } from '@context/deathCounter/DeathCounterProvider';
import DownloadPage from '@pages/DownloadPage';
import LandingPage from '@pages/LandingPage';
import { ModalProvider } from '@context/modal/ModalProvider';
import PageNotFound from '@pages/PageNotFound';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SocketProvider } from '@context/webSocket/WebSocketProvider';
import StatsPage from '@pages/StatsPage';
import { StatsProvider } from '@context/stats/StatsProvider';
import { Toaster } from "react-hot-toast";
import { grey } from "@mui/material/colors";

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
    components: {
      MuiButton: {
        styleOverrides: {
          containedPrimary: {
            backgroundColor: grey[700],
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: grey[600],
            },
          },
          outlinedPrimary: {
            borderColor: grey[500],
            color: "#FFFFFF",
            "&:hover": {
              borderColor: grey[400],
              backgroundColor: "rgba(255, 255, 255, 0.08)",
            },
          },
          textPrimary: {
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.08)",
            },
          },
        },
      },
    },
  });

  return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline/>
        <QueryClientProvider client={queryClient}>
          <AuthenticationProvider>
            <DeathListProvider>
              <StatsProvider>
                <SocketProvider>
                  <ModalProvider>
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
                          <Route path="stats" element={<StatsPage />} />
                          <Route path="download" element={<DownloadPage />} />
                        </Route>
                        <Route path='landing' element={<LandingPage/>} />
                        <Route element={<AppLayout/>}>
                          <Route path="*" element={<PageNotFound />} />
                        </Route>
                      </Routes>
                    </BrowserRouter>
                  </ModalProvider>
                </SocketProvider>
              </StatsProvider>
            </DeathListProvider>
          </AuthenticationProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        <Toaster 
          position="bottom-center" 
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff'
            },
          }}
        />
      </ThemeProvider>
  )
}

export default App
