import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import EntityForm from "@components/death_list/EntityForm";

const mocks = vi.hoisted(() => ({
  useDeathLists: vi.fn(),
  useIsMobile: vi.fn(),
  useSocketContext: vi.fn(),
}));

vi.mock("@context/deathCounter/DeathCounterContext", () => ({
  useDeathLists: mocks.useDeathLists,
}));

vi.mock("@hooks/useIsMobile", () => ({
  useIsMobile: mocks.useIsMobile,
}));

vi.mock("@context/webSocket/WebSocketContext", () => ({
  useSocketContext: mocks.useSocketContext,
}));

type SocketEvent = {
  gameToken: string | undefined;
  authToken: string | undefined;
  data?: unknown;
};
type SocketHandler = (event: SocketEvent) => void;

const handlers = new Map<string, SocketHandler>();
const socket = {
  on: vi.fn((event: string, handler: SocketHandler) => handlers.set(event, handler)),
  off: vi.fn((event: string) => handlers.delete(event)),
};

const addToList = vi.fn().mockResolvedValue(undefined);
const emitMessage = vi.fn();
const setEntityInEdit = vi.fn();
const removeEntityFromList = vi.fn().mockResolvedValue(undefined);
const refetch = vi.fn().mockResolvedValue(undefined);

const configureContext = (entityInEdit: {
  id?: number;
  name: string;
  deaths: number;
  description?: string;
} | null = null) => {
  mocks.useDeathLists.mockReturnValue({
    activeDeathList: { token: "test-token" },
    addToList,
    entityInEdit,
    removeEntityFromList,
    setEntityInEdit,
    refetch,
  });
  mocks.useSocketContext.mockReturnValue({ socket, emitMessage });
  mocks.useIsMobile.mockReturnValue(false);
};

describe("EntityForm descriptions", () => {
  beforeEach(() => {
    handlers.clear();
    addToList.mockClear();
    emitMessage.mockClear();
    setEntityInEdit.mockClear();
    removeEntityFromList.mockClear();
    refetch.mockClear();
    configureContext();
  });

  it("defaults a missing description to an empty string and submits it", () => {
    render(<EntityForm />);

    const description = screen.getByRole("textbox", { name: "Description" });
    expect(description).toHaveValue("");

    fireEvent.change(screen.getByRole("textbox", { name: "Name" }), {
      target: { value: "Margit" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(addToList).toHaveBeenCalledWith({
      name: "Margit",
      deaths: 0,
      description: "",
    });
  });

  it("submits a description entered by the user", () => {
    render(<EntityForm />);

    fireEvent.change(screen.getByRole("textbox", { name: "Name" }), {
      target: { value: "Malenia" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Description" }), {
      target: { value: "Found a safe opening after her second attack." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(addToList).toHaveBeenCalledWith({
      name: "Malenia",
      deaths: 0,
      description: "Found a safe opening after her second attack.",
    });
  });

  it("defaults a missing description on incoming socket data to an empty string", () => {
    configureContext({
      id: 1,
      name: "Malenia",
      deaths: 3,
      description: "Old description",
    });
    render(<EntityForm />);

    act(() => {
      handlers.get("clientBossData")?.({
        gameToken: "test-token",
        authToken: undefined,
        data: { id: 2, name: "Radahn", deaths: 4 },
      });
    });

    expect(screen.getByRole("textbox", { name: "Description" })).toHaveValue("");
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue("Radahn");
  });

  it("includes the description when sending current boss data to a newly connected client", () => {
    configureContext({
      id: 2,
      name: "Radahn",
      deaths: 4,
      description: "Use the arena pillars for cover.",
    });
    render(<EntityForm />);

    act(() => {
      handlers.get("clientConnected")?.({
        gameToken: "test-token",
        authToken: undefined,
      });
    });

    expect(emitMessage).toHaveBeenCalledWith("clientBossData", {
      id: 2,
      name: "Radahn",
      deaths: 4,
      description: "Use the arena pillars for cover.",
    });
  });

  it("shows Clear when the description is the only field with a value", () => {
    render(<EntityForm />);

    fireEvent.change(screen.getByRole("textbox", { name: "Description" }), {
      target: { value: "A note with no boss selected yet." },
    });

    fireEvent.click(screen.getByRole("button", { name: "Clear" }));

    expect(screen.getByRole("textbox", { name: "Description" })).toHaveValue("");
  });
});
