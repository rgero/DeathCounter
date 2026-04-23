import { z } from "zod";

export const MessageSchema = z.object({
  event: z.enum(['bossDeathIncrement', 'genericDeathIncrement', 'bossDeathDecrement', 'bossDefeated', 'message', 'bossDeathSet', 'bossNameSet', "clientBossData", "clientConnected"]),
  authToken: z.string(),
  gameToken: z.string(),
  data: z.union([z.string(), z.number(), z.object({id: z.number().optional(), deaths: z.number(), name: z.string()})]).optional()
})