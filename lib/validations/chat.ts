import { z } from 'zod';

export const chatMessageSchema = z.object({
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(4000, 'Message must be less than 4000 characters'),
  sessionId: z.string().optional(),
});

export const chatSettingsSchema = z.object({
  model: z.enum(['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'claude-3', 'llama-2']),
  temperature: z
    .number()
    .min(0, 'Temperature must be at least 0')
    .max(2, 'Temperature must be at most 2'),
  maxTokens: z
    .number()
    .min(100, 'Max tokens must be at least 100')
    .max(8000, 'Max tokens must be at most 8000'),
  systemPrompt: z.string().optional(),
  sapIntegration: z.boolean().default(true),
  contextWindow: z
    .number()
    .min(1000, 'Context window must be at least 1000')
    .max(32000, 'Context window must be at most 32000'),
});

export const chatSessionSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
});

export type ChatMessageFormData = z.infer<typeof chatMessageSchema>;
export type ChatSettingsFormData = z.infer<typeof chatSettingsSchema>;
export type ChatSessionFormData = z.infer<typeof chatSessionSchema>;
