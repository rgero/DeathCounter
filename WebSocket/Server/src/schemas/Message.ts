import { z } from "zod";

export const MessageSchema = z.object({
  event: z.enum(['bossDeathIncrement', 'genericDeathIncrement', 'bossBeaten', 'message']),
  authToken: z.string(),
  gameToken: z.string(),
})