// lib/zod/setSchema.ts

import { z } from 'zod';

export const createSetSchema = z.object({
	title: z.string().min(1, 'Title is required'),
});

export type CreateSetInput = z.infer<typeof createSetSchema>;
