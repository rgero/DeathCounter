import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@mui/material", () => ({
  Box: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Divider: () => <hr />,
  Stack: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Typography: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

vi.mock("@mui/material/colors", () => ({ grey: {} }));

import StatsCard from "@components/stats/StatsCard";
import { DeathList } from "@interfaces/DeathList";

const makeList = (entities: { name: string; deaths: number }[]): DeathList => ({
  name: "Test List",
  currentlyActive: true,
  entityList: entities,
});

describe("StatsCard", () => {
  it("renders zeros when deathList is null", () => {
    render(<StatsCard deathList={null} />);
    expect(screen.getAllByText("0")).toHaveLength(4);
  });

  it("renders correct total bosses and total deaths", () => {
    render(<StatsCard deathList={makeList([{ name: "Margit", deaths: 5 }, { name: "Godrick", deaths: 3 }])} />);
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
  });

  it("renders correct average deaths per boss", () => {
    render(<StatsCard deathList={makeList([{ name: "Margit", deaths: 5 }, { name: "Godrick", deaths: 3 }])} />);
    expect(screen.getByText("4.0")).toBeInTheDocument();
  });

  it("shows hardest boss with death count", () => {
    render(<StatsCard deathList={makeList([{ name: "Margit", deaths: 10 }, { name: "Godrick", deaths: 3 }])} />);
    expect(screen.getByText("Margit (10)")).toBeInTheDocument();
  });

  it("shows — for hardest boss when list is empty", () => {
    render(<StatsCard deathList={makeList([])} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("renders correct deathless boss count", () => {
    render(
      <StatsCard
        deathList={makeList([
          { name: "Margit", deaths: 0 },
          { name: "Godrick", deaths: 3 },
          { name: "Rennala", deaths: 0 },
        ])}
      />
    );
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("picks the boss with the most deaths as hardest when tied", () => {
    render(<StatsCard deathList={makeList([{ name: "A", deaths: 5 }, { name: "B", deaths: 5 }])} />);
    // reduce keeps the first on a tie, so "A" wins
    expect(screen.getByText("A (5)")).toBeInTheDocument();
  });
});
