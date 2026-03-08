import { useMediaQuery, useTheme } from '@mui/material';

/**
 * Custom hook to determine if the current viewport is mobile-sized
 * @returns boolean - true if viewport is mobile (below 'md' breakpoint), false otherwise
 */
export const useIsMobile = (): boolean => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("md"));
};
