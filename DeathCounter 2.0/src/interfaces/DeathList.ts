import { Entity } from "./Entity";
import { Game } from "./Game";

export interface DeathList {
  id: number;
  game: Game;
  entityList: Entity[];
}