import { z } from "zod";

export const MessageSchema = z.object({
  event: z.enum(['bossDeathIncrement', 'genericDeathIncrement', 'keyQuery']),
  payload: z.object({
    authToken: z.string(),
    gameId: z.string().optional(),
    userId: z.string().optional(),
  }).optional(),
})