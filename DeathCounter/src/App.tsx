import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AsyncBoundary from '@components/ui/AsyncBoundary';
import AppLayout from '@components/ui/AppLayout';
import AuthenticatedRoute from '@components/AuthenicatedRoute';
import { AuthenticationProvider } from '@context/authentication/AuthenticationProvider';
import { DeathListProvider } from '@context/deathCounter/DeathCounterProvider';
import { ModalProvider } from '@context/modal/ModalProvider';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SocketProvider } from '@context/webSocket/WebSocketProvider';
import { StatsProvider } from '@context/stats/StatsProvider';
import { Toaster } from "react-hot-toast";
import { grey } from "@mui/material/colors";
import Loading from '@components/ui/Loading';

const DashboardPage = lazy(() => import('@pages/DashboardPage'));
const DownloadPage = lazy(() => import('@pages/DownloadPage'));
const LandingPage = lazy(() => import('@pages/LandingPage'));
const PageNotFound = lazy(() => import('@pages/PageNotFound'));
const SharedDeathListPage = lazy(() => import('@pages/SharedDeathListPage'));
const StatsPage = lazy(() => import('@pages/StatsPage'));

const RouteFallback = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<Loading />}>
    {children}
  </Suspense>
);

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
          root: ({ ownerState }) => ({
            ...(ownerState.variant === "contained" && ownerState.color === "primary" && {
              backgroundColor: grey[700],
              color: "#FFFFFF",
              "&:hover": {
                backgroundColor: grey[600],
              },
            }),
            ...(ownerState.variant === "outlined" && ownerState.color === "primary" && {
              borderColor: grey[500],
              color: "#FFFFFF",
              "&:hover": {
                borderColor: grey[400],
                backgroundColor: "rgba(255, 255, 255, 0.08)",
              },
            }),
            ...(ownerState.variant === "text" && ownerState.color === "primary" && {
              color: "#FFFFFF",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.08)",
              },
            }),
          }),
        },
      },
    },
  });

  return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline/>
        <QueryClientProvider client={queryClient}>
          <AsyncBoundary fallback={<Loading />}>
            <AuthenticationProvider>
              <BrowserRouter>
                <Routes>
                  <Route
                    element={
                      <AuthenticatedRoute>
                        <AsyncBoundary fallback={<Loading />}>
                          <DeathListProvider>
                            <StatsProvider>
                              <SocketProvider>
                                <ModalProvider>
                                  <AppLayout />
                                </ModalProvider>
                              </SocketProvider>
                            </StatsProvider>
                          </DeathListProvider>
                        </AsyncBoundary>
                      </AuthenticatedRoute>
                    }
                  >
                    <Route index element={<RouteFallback><DashboardPage/></RouteFallback>}/>
                    <Route path="stats" element={<RouteFallback><StatsPage /></RouteFallback>} />
                    <Route path="download" element={<RouteFallback><DownloadPage /></RouteFallback>} />
                  </Route>
                  <Route path='landing' element={<RouteFallback><LandingPage/></RouteFallback>} />
                  <Route path='share/:token' element={<AppLayout/>}>
                    <Route
                      index
                      element={<RouteFallback><SharedDeathListPage /></RouteFallback>}
                    />
                  </Route>
                  <Route element={<AppLayout/>}>
                    <Route path="*" element={<RouteFallback><PageNotFound /></RouteFallback>} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </AuthenticationProvider>
          </AsyncBoundary>
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
