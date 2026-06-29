import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@mui/material', () => ({
  Box: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick} type="button">{children}</button>
  ),
  Stack: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Typography: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

import AsyncBoundary from '@components/ui/AsyncBoundary';

let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

describe('AsyncBoundary', () => {
  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('shows the error state and retries successfully', async () => {
    let shouldFail = true;

    const ProblemChild = () => {
      if (shouldFail) {
        throw new Error('Failed to load data');
      }

      return <div>Recovered content</div>;
    };

    render(
      <AsyncBoundary fallback={<div>Loading...</div>}>
        <ProblemChild />
      </AsyncBoundary>
    );

    expect(await screen.findByText('Unable to load this view.')).toBeInTheDocument();
    expect(screen.getByText('Failed to load data')).toBeInTheDocument();

    shouldFail = false;
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('Recovered content')).toBeInTheDocument();
  });
});