'use server';
import { CreateStepInput, createStepSchema } from '@/lib/zod/stepSchema';
import { prisma } from '@/prisma/prisma-client';

export async function getStepsBySetId(setId: number) {
	const steps = await prisma.step.findMany({
		where: {
			setId: setId, // Получаем шаги для конкретного сета
		},
		orderBy: {
			order: 'asc', // Упорядочиваем шаги по полю `order`
		},
	});

	return steps;
}

export async function createStep(data: CreateStepInput) {
	const parsedData = createStepSchema.safeParse(data);

	if (!parsedData.success) {
		throw new Error(parsedData.error.errors.map(e => e.message).join(', '));
	}

	const newStep = await prisma.step.create({
		data: {
			title: parsedData.data.title,
			description: parsedData.data.description,
			order: parsedData.data.order,
			setId: parsedData.data.setId,
			elementId: parsedData.data.elementId,
			imageUrl: parsedData.data.imageUrl,
			imageChecked: parsedData.data.imageChecked,
			imageHeight: parsedData.data.imageHeight,
			imageWidth: parsedData.data.imageWidth,
			pageUrl: parsedData.data.pageUrl,
		},
	});

	return newStep;
}
