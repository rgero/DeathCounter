import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import AuthenticatedRoute from '@components/AuthenicatedRoute';
import { AuthContext, AuthContextType } from '@context/authentication/AuthenticationContext';

const createAuthContextValue = (overrides: Partial<AuthContextType>): AuthContextType => ({
  user: null,
  loginWithGoogle: async () => {},
  logout: async () => {},
  ...overrides,
});

const renderRoute = (contextValue: AuthContextType) => {
  return render(
    <AuthContext.Provider value={contextValue}>
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={(
              <AuthenticatedRoute>
                <div>Secret area</div>
              </AuthenticatedRoute>
            )}
          />
          <Route path="/landing" element={<div>Landing page</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('AuthenticatedRoute', () => {
  it('redirects unauthenticated users to the landing page', async () => {
    renderRoute(createAuthContextValue({ user: null }));

    expect(await screen.findByText('Landing page')).toBeInTheDocument();
    expect(screen.queryByText('Secret area')).not.toBeInTheDocument();
  });

  it('renders protected content for authenticated users', async () => {
    renderRoute(
      createAuthContextValue({
        user: { id: 'user-1' } as AuthContextType['user'],
      })
    );

    expect(await screen.findByText('Secret area')).toBeInTheDocument();
    expect(screen.queryByText('Landing page')).not.toBeInTheDocument();
  });
});