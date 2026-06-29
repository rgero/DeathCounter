import { Box, Button, Stack, Typography } from "@mui/material";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import React, { Suspense } from "react";

interface AsyncBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

interface AsyncErrorBoundaryProps extends AsyncBoundaryProps {
  onReset: () => void;
}

interface AsyncErrorBoundaryState {
  error: Error | null;
}

class AsyncErrorBoundary extends React.Component<AsyncErrorBoundaryProps, AsyncErrorBoundaryState> {
  state: AsyncErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): AsyncErrorBoundaryState {
    return { error };
  }

  handleRetry = () => {
    this.setState({ error: null });
    this.props.onReset();
  };

  render() {
    if (this.state.error) {
      return (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 3,
          }}
        >
          <Stack spacing={2} sx={{ alignItems: "center", textAlign: "center", maxWidth: 360 }}>
            <Typography variant="h6">Unable to load this view.</Typography>
            <Typography color="text.secondary">{this.state.error.message}</Typography>
            <Button variant="contained" onClick={this.handleRetry}>Retry</Button>
          </Stack>
        </Box>
      );
    }

    return <Suspense fallback={this.props.fallback}>{this.props.children}</Suspense>;
  }
}

const AsyncBoundary = ({ children, fallback }: AsyncBoundaryProps) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <AsyncErrorBoundary fallback={fallback} onReset={reset}>
          {children}
        </AsyncErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

export default AsyncBoundary;