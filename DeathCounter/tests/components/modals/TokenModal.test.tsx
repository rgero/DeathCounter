import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import TokenModal from '@components/modals/TokenModal';
import { encryptAuthToken } from '@utils/crypt';
import toast from 'react-hot-toast';

const state = vi.hoisted(() => ({ token: 'first-list' }));
vi.mock('@utils/crypt', () => ({ encryptAuthToken: vi.fn() }));
vi.mock('@context/deathCounter/DeathCounterContext', () => ({
  useDeathLists: () => ({ activeDeathList: { name: 'Game', token: state.token }, regenerateToken: vi.fn() }),
}));
vi.mock('@context/modal/ModalContext', () => ({
  useModalProvider: () => ({ tokenModalOpen: true, toggleTokenModal: vi.fn() }),
}));
vi.mock('@components/modals/BaseModal', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }));

beforeEach(() => { state.token = 'first-list'; vi.resetAllMocks(); });
afterEach(() => { vi.unstubAllGlobals(); });

it('disables copying until encryption is ready and ignores stale list-token results', async () => {
  const pending = new Map<string, (value: string) => void>();
  vi.mocked(encryptAuthToken).mockImplementation(token => new Promise(resolve => { pending.set(token!, resolve); }));
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal('navigator', { clipboard: { writeText } });
  const view = render(<TokenModal />);
  expect(screen.getByRole('button', { name: 'Copy tokens' })).toBeDisabled();
  state.token = 'second-list';
  view.rerender(<TokenModal />);
  await act(async () => { pending.get('first-list')!('old-auth'); });
  expect(screen.getByRole('button', { name: 'Copy tokens' })).toBeDisabled();
  await act(async () => { pending.get('second-list')!('new-auth'); });
  fireEvent.click(screen.getByRole('button', { name: 'Copy tokens' }));
  await waitFor(() => expect(writeText).toHaveBeenCalledWith(JSON.stringify({ gameToken: 'second-list', authToken: 'new-auth' })));
  expect(toast.success).toHaveBeenCalled();
});

it('reports encryption and clipboard errors without claiming a successful copy', async () => {
  vi.mocked(encryptAuthToken).mockRejectedValue(new Error('missing key'));
  const view = render(<TokenModal />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Unable to encrypt');
  expect(screen.getByRole('button', { name: 'Copy tokens' })).toBeDisabled();
  state.token = 'another-list';
  vi.mocked(encryptAuthToken).mockResolvedValue('new-auth');
  vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } });
  view.rerender(<TokenModal />);
  await waitFor(() => expect(screen.getByRole('button', { name: 'Copy tokens' })).toBeEnabled());
  fireEvent.click(screen.getByRole('button', { name: 'Copy tokens' }));
  await waitFor(() => expect(toast.error).toHaveBeenCalled());
  expect(toast.success).not.toHaveBeenCalled();
});