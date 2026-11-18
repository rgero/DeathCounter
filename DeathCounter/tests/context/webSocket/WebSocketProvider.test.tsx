import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { SocketProvider } from '@context/webSocket/WebSocketProvider';
import { useSocketContext } from '@context/webSocket/WebSocketContext';
import { encryptAuthToken } from '@utils/crypt';

const state = vi.hoisted(() => ({ token: 'first-list', sockets: [] as Array<{
  connected: boolean;
  handlers: Record<string, (...args: unknown[]) => void>;
  emit: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
}> }));
vi.mock('@context/deathCounter/DeathCounterContext', () => ({
  useDeathLists: () => ({ activeDeathList: { id: 1, token: state.token } }),
}));
vi.mock('@utils/crypt', () => ({ encryptAuthToken: vi.fn() }));
vi.mock('socket.io-client', () => ({ default: () => {
  const socket = {
    connected: true,
    handlers: {} as Record<string, (...args: unknown[]) => void>,
    emit: vi.fn(),
    disconnect: vi.fn(() => { socket.connected = false; }),
    on(event: string, handler: (...args: unknown[]) => void) { socket.handlers[event] = handler; },
  };
  state.sockets.push(socket);
  return socket;
} }));

function Consumer() {
  const { emitMessage } = useSocketContext();
  return <button onClick={() => emitMessage('genericDeathIncrement', 1)}>Send</button>;
}

beforeEach(() => {
  vi.resetAllMocks();
  state.token = 'first-list';
  state.sockets = [];
  vi.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(() => { vi.restoreAllMocks(); });

it('waits for encryption and never sends an old token through a replaced socket', async () => {
  let resolveFirst!: (value: string) => void;
  const first = new Promise<string>(resolve => { resolveFirst = resolve; });
  vi.mocked(encryptAuthToken).mockImplementation(token => token === 'first-list' ? first : Promise.resolve('second-auth'));
  const view = render(<SocketProvider><Consumer /></SocketProvider>);
  const oldSocket = state.sockets[0];
  act(() => oldSocket.handlers.connect());
  fireEvent.click(screen.getByText('Send'));
  expect(oldSocket.emit).not.toHaveBeenCalled();
  state.token = 'second-list';
  view.rerender(<SocketProvider><Consumer /></SocketProvider>);
  const newSocket = state.sockets[1];
  act(() => newSocket.handlers.connect());
  await act(async () => { resolveFirst('first-auth'); });
  expect(oldSocket.emit).not.toHaveBeenCalled();
  expect(newSocket.emit).toHaveBeenCalledWith('clientConnected', { gameToken: 'second-list', authToken: 'second-auth' });
  fireEvent.click(screen.getByText('Send'));
  await waitFor(() => expect(newSocket.emit).toHaveBeenCalledWith('genericDeathIncrement', {
    gameToken: 'second-list', authToken: 'second-auth', data: 1,
  }));
});

it('does not send after disconnect or when token encryption fails', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.mocked(encryptAuthToken).mockRejectedValue(new Error('missing key'));
  const view = render(<SocketProvider><Consumer /></SocketProvider>);
  const socket = state.sockets[0];
  act(() => socket.handlers.connect());
  fireEvent.click(screen.getByText('Send'));
  await waitFor(() => expect(console.error).toHaveBeenCalled());
  expect(socket.emit).not.toHaveBeenCalled();
  view.unmount();
  expect(socket.disconnect).toHaveBeenCalled();
});