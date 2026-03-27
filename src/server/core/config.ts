import { z } from 'zod';

export const ConfigSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  GEMINI_API_KEY: z.string().optional(),
  DB_PATH: z.string().default('raasp.db'),
  RELIABILITY_THRESHOLD: z.number().default(0.7),
});

export type Config = z.infer<typeof ConfigSchema>;

export const config = ConfigSchema.parse({
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  DB_PATH: process.env.DB_PATH,
  RELIABILITY_THRESHOLD: 0.7,
});
