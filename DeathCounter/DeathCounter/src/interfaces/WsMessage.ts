export interface WsMessage {
  event: string;
  gameToken: string | undefined;
  authToken: string | undefined;
}