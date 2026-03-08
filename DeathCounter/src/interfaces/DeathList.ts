import { Entity } from "./Entity";

export interface DeathList {
  id?: number;
  owner_id?: string;
  name: string;
  token?: string;
  description?: string;
  currentlyActive: boolean;
  entityList: Entity[];
}