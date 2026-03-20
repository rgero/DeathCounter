import { z } from "zod";

export const MessageSchema = z.object({
  event: z.enum(['bossDeathIncrement', 'genericDeathIncrement', 'bossDeathDecrement', 'bossDefeated', 'message', 'bossDeathSet', 'bossNameSet']),
  authToken: z.string(),
  gameToken: z.string(),
  data: z.union([z.string(), z.number()]).optional()
})