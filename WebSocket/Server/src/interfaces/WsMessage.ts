import { WsPayload } from "./WsPayload"

export type WsMessage = BossDeathIncrement | GenericDeathIncrement | SystemNotice

export interface BossDeathIncrement {
  event: 'bossDeathIncrement',
  payload: WsPayload
}

export interface GenericDeathIncrement{
  event: 'genericDeathIncrement',
  payload: WsPayload
}

export interface SystemNotice {
  event: 'systemNotice',
  contents: string,
}
