export interface WsEvent {
  event: string;
  gameToken?: string;
  data?: string | number;
} 