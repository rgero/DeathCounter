import { z } from "zod";

export const MessageSchema = z.object({
  event: z.enum(['bossDeathIncrement', 'genericDeathIncrement', 'bossBeaten', 'message']),
  payload: z.object({
    authToken: z.string(),
    gameId: z.string().optional(),
  }).optional(),
})