import { z } from 'zod';

// Определяем схему для шага
export const createStepSchema = z
	.object({
		title: z.string().min(1, 'Title is required'),
		description: z.string().min(1, 'Description is required'),
		order: z.preprocess(
			val => Number(val),
			z.number().min(1, 'Order is required')
		),
		setId: z.number(),
		elementId: z.string().min(1, 'Element ID is required'),
		imageUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
		imageChecked: z.boolean(),
		imageHeight: z.preprocess(
			val => (val === '' ? undefined : Number(val)), // Преобразуем в число или undefined
			z.number().optional()
		),
		imageWidth: z.preprocess(
			val => (val === '' ? undefined : Number(val)), // Преобразуем в число или undefined
			z.number().optional()
		),
		pageUrl: z.string().url('Invalid URL format'),
	})
	.refine(
		data => {
			if (data.imageChecked) {
				return (
					data.imageHeight !== undefined &&
					data.imageWidth !== undefined &&
					data.imageHeight >= 0 &&
					data.imageWidth >= 0
				);
			}
			return true;
		},
		{
			message:
				'Image height and width must be positive numbers when image is checked',
			path: ['imageHeight'],
		}
	);

// Определяем тип данных для шага
export type CreateStepInput = z.infer<typeof createStepSchema>;
