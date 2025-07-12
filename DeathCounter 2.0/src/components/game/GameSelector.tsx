import { MenuItem, Select, SelectChangeEvent } from "@mui/material"

import { useDeathLists } from "../../context/DeathCounterContext";

const GameSelector = () => {
  const { deathLists, getCurrentlyActiveDeathList, updateActiveStatus } = useDeathLists();

  const handleChange = (event: SelectChangeEvent) => {
    const selectedGameId = event.target.value;
    updateActiveStatus(Number(selectedGameId));
  }

  const games = deathLists.map(deathList => ({
    id: String(deathList.id),
    name: deathList.name
  }));

  return (
    <Select
      id="game-selector"
      value={getCurrentlyActiveDeathList() ? String(getCurrentlyActiveDeathList()!.id) : ""}
      onChange={handleChange}
      size="small"
    >
      {games.map(game => (
        <MenuItem key={game.id} value={game.id}>{game.name}</MenuItem>
      ))}
    </Select>
  )
}

export default GameSelector
