import { useMediaQuery, useTheme } from "@mui/material";

export const isMobile = (): boolean => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("md"));
}