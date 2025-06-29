import { WsPayload } from "./WsPayload"

export type WsMessage = BossDeathIncrement | GenericDeathIncrement | KeyQuery

export interface BossDeathIncrement {
  event: 'bossDeathIncrement',
  payload?: WsPayload
}

export interface GenericDeathIncrement{
  event: 'genericDeathIncrement',
  payload?: WsPayload
}

export interface KeyQuery {
  event: 'keyQuery',
  payload?: WsPayload
}