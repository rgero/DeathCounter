import { z } from "zod";

export const MessageSchema = z.object({
  event: z.enum(['bossDeathIncrement', 'genericDeathIncrement', 'message']),
  payload: z.object({
    authToken: z.string(),
    userId: z.string().optional(),
  }).optional(),
})