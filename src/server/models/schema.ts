import { z } from 'zod';

export const QueryRequestSchema = z.object({
  question: z.string().min(1, "Question cannot be empty"),
});

export type QueryRequest = z.infer<typeof QueryRequestSchema>;

export const QueryResponseSchema = z.object({
  question: z.string(),
  answer: z.string(),
  confidence: z.number(),
  status: z.enum(['Reliable', 'Uncertain']),
  timestamp: z.string(),
});

export type QueryResponse = z.infer<typeof QueryResponseSchema>;

export const HealthResponseSchema = z.object({
  status: z.string(),
  timestamp: z.string(),
});
