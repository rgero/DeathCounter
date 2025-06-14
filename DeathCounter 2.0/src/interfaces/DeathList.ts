import { Entity } from "./Entity";
import { Game } from "./Game";

export interface DeathList {
  id?: number;
  owner_id?: string;
  game: Game;
  entityList: Entity[];
}