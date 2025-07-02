import { Entity } from "./Entity";

export interface DeathList {
  id?: number;
  owner_id?: string;
  name: string;
  description?: string;
  currentlyActive: boolean;
  entityList: Entity[];
}