import { z } from 'zod';

// Определяем схему для шага
export const createStepSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().optional(),
	order: z.number().min(0, 'Order is required'),
	setId: z.number(),
	elementId: z.string(),
	imageUrl: z.string().optional(),
	imageChecked: z.boolean().default(false),
	imageHeight: z.number().optional(),
	imageWidth: z.number().optional(),
	pageUrl: z.string().url('Invalid URL format'),
});

// Определяем тип данных для шага
export type CreateStepInput = z.infer<typeof createStepSchema>;
