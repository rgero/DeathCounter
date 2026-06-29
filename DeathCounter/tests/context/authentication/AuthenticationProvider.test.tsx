import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@mui/material', () => ({
  Box: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick} type="button">{children}</button>
  ),
  Stack: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Typography: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

import AsyncBoundary from '@components/ui/AsyncBoundary';

vi.mock('@services/apiAuthentication', () => ({
  getCurrentUser: vi.fn(),
  logout: vi.fn(),
  signInWithGoogle: vi.fn(),
}));

vi.mock('@services/supabase', () => ({
  default: {
    auth: {
      onAuthStateChange: vi.fn(() => ({
        data: {
          subscription: {
            unsubscribe: vi.fn(),
          },
        },
      })),
    },
  },
}));

import { AuthenticationProvider } from '@context/authentication/AuthenticationProvider';
import { useAuthenticationContext } from '@context/authentication/AuthenticationContext';
import { getCurrentUser } from '@services/apiAuthentication';

const mockedGetCurrentUser = vi.mocked(getCurrentUser);

const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const AuthConsumer = () => {
  const { user } = useAuthenticationContext();

  return <div>{user ? `User:${user.id}` : 'No user'}</div>;
};

describe('AuthenticationProvider', () => {
  it('suspends until the auth query resolves and then provides the user', async () => {
    let resolveUser: ((value: { id: string }) => void) | undefined;

    mockedGetCurrentUser.mockImplementationOnce(
      () =>
        new Promise<{ id: string }>((resolve) => {
          resolveUser = resolve;
        })
    );

    render(
      <QueryClientProvider client={createQueryClient()}>
        <AsyncBoundary fallback={<div>Loading authentication...</div>}>
          <AuthenticationProvider>
            <AuthConsumer />
          </AuthenticationProvider>
        </AsyncBoundary>
      </QueryClientProvider>
    );

    expect(screen.getByText('Loading authentication...')).toBeInTheDocument();

    resolveUser?.({ id: 'user-42' });

    expect(await screen.findByText('User:user-42')).toBeInTheDocument();
  });
});