import { WsPayload } from "./WsPayload"

export type WsMessage = BossDeathIncrement | GenericDeathIncrement | BossBeaten

export interface BossDeathIncrement {
  event: 'bossDeathIncrement',
  payload?: WsPayload
}

export interface GenericDeathIncrement{
  event: 'genericDeathIncrement',
  payload?: WsPayload
}

export interface BossBeaten {
  event: 'bossBeaten',
  payload?: WsPayload
}