
export type WsMessage = ChatMessage | SystemNotice

export interface ChatMessage {
  event: 'chat',
  contents: string
}

export interface SystemNotice {
  event: 'systemNotice',
  contents: string,
}
