import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { Suspense, type ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DeathList } from '@interfaces/DeathList';
import { getDeathListByToken } from '@services/apiDeathCounter';
import SharedDeathListPage from '@pages/SharedDeathListPage';

vi.mock('@mui/material', () => ({
  Container: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock('@pages/PageNotFound', () => ({
  default: () => <div>Page not found</div>,
}));

vi.mock('@components/death_list/SharedListHeader', () => ({
  default: ({ deathList }: { deathList: DeathList }) => <div>{deathList.name}</div>,
}));

vi.mock('@components/death_list/SharedListStats', () => ({
  default: ({ totalDeaths, totalEntities }: { totalDeaths: number; totalEntities: number }) => (
    <div>{`${totalDeaths}:${totalEntities}`}</div>
  ),
}));

vi.mock('@components/death_list/SharedEntityTable', () => ({
  default: ({ entities }: { entities: Array<{ name: string }> }) => (
    <div>{entities.map((entity) => entity.name).join(', ')}</div>
  ),
}));

vi.mock('@services/apiDeathCounter', () => ({
  getDeathListByToken: vi.fn(),
}));

const mockedGetDeathListByToken = vi.mocked(getDeathListByToken);
let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderPage = () => {
  const queryClient = createQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/share/test-token']}>
        <Routes>
          <Route
            path="/share/:token"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <SharedDeathListPage />
              </Suspense>
            }
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('SharedDeathListPage', () => {
  beforeEach(() => {
    mockedGetDeathListByToken.mockReset();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('shows the suspense fallback before rendering the shared death list', async () => {
    let resolveDeathList: ((value: DeathList) => void) | undefined;

    mockedGetDeathListByToken.mockImplementation(
      () =>
        new Promise<DeathList>((resolve) => {
          resolveDeathList = resolve;
        })
    );

    renderPage();

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    resolveDeathList?.({
      id: 1,
      name: 'Elden Ring',
      description: 'Boss tracker',
      currentlyActive: false,
      token: 'test-token',
      entityList: [{ id: 1, name: 'Margit', deaths: 7 }],
    });

    expect(await screen.findByText('Elden Ring')).toBeInTheDocument();
    expect(screen.getByText('7:1')).toBeInTheDocument();
    expect(screen.getByText('Margit')).toBeInTheDocument();
  });

  it('renders the not found page when the shared list lookup fails', async () => {
    mockedGetDeathListByToken.mockRejectedValue(new Error('Shared Death List not found'));

    renderPage();

    expect(await screen.findByText('Page not found')).toBeInTheDocument();
  });
});