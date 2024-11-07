import * as z from 'zod';

export const urlDescription = z.object({
	id: z.number(),
	// tagId: z.number(),
	value: z.string(),
	order: z.number(),
});

export const urlSchema = z.object({
	id: z.number().int(), // `id` опционален, так как он будет автоматически генерироваться
	url: z.string().min(1, 'Url must be at least 1 character long'),
	description: z.array(urlDescription).nullable(),
	validFrom: z.preprocess(
		arg => new Date(arg as string),
		z
			.date()
			.refine(date => !isNaN(date.getTime()), 'Valid From must be a valid date')
	),
	validTo: z.preprocess(
		arg => new Date(arg as string),
		z
			.date()
			.refine(date => !isNaN(date.getTime()), 'Valid To must be a valid date')
	),
	status: z.enum(['ACTIVE', 'INACTIVE', 'HIDDEN', 'ARCHIVED', 'INITIAL']),
	// userId: z.string().cuid2(),
});

// export const tagsArraySchema = z.array(tagSchema);

export const urlFormSchema = urlSchema
	.extend({
		id: z.number().int().optional(),
		// userId: z.string().cuid2().optional(),
		honeyPot: z.string().max(0),
	})
	.superRefine((data, ctx) => {
		if (data.status === 'INITIAL') {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Status must be not empty',
				path: ['status'],
			});
		}
	});
