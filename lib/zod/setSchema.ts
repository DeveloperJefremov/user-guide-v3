// lib/zod/setSchema.ts

import { Status } from '@prisma/client';
import { z } from 'zod';

export const createSetSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	pageUrl: z.string().url('Invalid URL').min(1, 'Page URL is required'), // Добавляем поле pageUrl
	status: z.nativeEnum(Status),
	isCompleted: z.boolean().optional(),
});

export type CreateSetInput = z.infer<typeof createSetSchema>;
