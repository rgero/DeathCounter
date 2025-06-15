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
    name: deathList.game.name
  }));

  return (
    <Select
      labelId="game-selector"
      id="game-selector"
      value={getCurrentlyActiveDeathList() ? String(getCurrentlyActiveDeathList()!.id) : ""}
      label="Game"
      onChange={handleChange}
    >
      {games.map(game => (
        <MenuItem key={game.id} value={game.id}>{game.name}</MenuItem>
      ))}
    </Select>
  )
}

export default GameSelector
