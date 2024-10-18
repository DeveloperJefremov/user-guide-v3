import { z } from 'zod';

// Определяем схему для шага
export const createStepSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().min(1, 'Description is required'),
	order: z.preprocess(
		val => Number(val),
		z.number().min(1, 'Order is required')
	),
	setId: z.number(),
	elementId: z.string().min(1, 'Element ID is required'),
	imageUrl: z.string().url('Invalid URL format').optional(),

	imageChecked: z.boolean(),
	imageHeight: z.number().min(1, 'Image height is required').optional(),
	imageWidth: z.number().min(1, 'Image width is required').optional(),
	pageUrl: z.string().url('Invalid URL format'),
});

// Определяем тип данных для шага
export type CreateStepInput = z.infer<typeof createStepSchema>;
