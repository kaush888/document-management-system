import { z } from 'zod';

export const createDocumentSchema = z.object({
  title: z.string().nonempty('Title is required'),
  description: z.string().optional(),
});

export type CreateDocumentDto = z.infer<typeof createDocumentSchema>;

export const updateDocumentSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

export type UpdateDocumentDto = z.infer<typeof updateDocumentSchema>;
