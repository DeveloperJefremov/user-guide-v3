// lib/zod/setSchema.ts

import { Status } from '@prisma/client';
import { z } from 'zod';

export const createSetSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	status: z.nativeEnum(Status),
});

export type CreateSetInput = z.infer<typeof createSetSchema>;
