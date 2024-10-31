'use server';
import { CreateStepInput, createStepSchema } from '@/lib/zod/stepSchema';
import { prisma } from '@/prisma/prisma-client';

// export async function getStepsBySetId(setId: number) {
// 	const steps = await prisma.step.findMany({
// 		where: {
// 			setId: setId, // Получаем шаги для конкретного сета
// 		},
// 		orderBy: {
// 			order: 'asc', // Упорядочиваем шаги по полю `order`
// 		},

// 	});

// 	return steps;
// }

export async function createStep(data: CreateStepInput) {
	const parsedData = createStepSchema.safeParse(data);

	if (!parsedData.success) {
		throw new Error(parsedData.error.errors.map(e => e.message).join(', '));
	}

	try {
		const newStep = await prisma.step.create({
			data: {
				title: parsedData.data.title,
				description: parsedData.data.description,
				order: parsedData.data.order,
				setId: parsedData.data.setId,
				elementId: parsedData.data.elementId,
				imageUrl: parsedData.data.imageUrl ?? '', // Дефолтное значение
				imageChecked: parsedData.data.imageChecked,
				imageHeight: parsedData.data.imageHeight,
				imageWidth: parsedData.data.imageWidth,
				// pageUrl: parsedData.data.pageUrl,
			},
		});
		return newStep;
	} catch (error) {
		// Логирование ошибок для упрощенной отладки
		console.error('Error creating step:', error);
		throw new Error('Error creating step in database');
	}
}

export async function deleteStep(stepId: number) {
	try {
		await prisma.step.delete({
			where: { id: stepId },
		});
	} catch (error) {
		throw new Error('Error deleting step:');
	}
}

export async function updateStep(stepId: number, data: CreateStepInput) {
	// Валидация данных перед обновлением
	const parsedData = createStepSchema.safeParse(data);

	if (!parsedData.success) {
		throw new Error(parsedData.error.errors.map(e => e.message).join(', '));
	}

	try {
		const updatedStep = await prisma.step.update({
			where: { id: stepId },
			data: {
				title: parsedData.data.title,
				description: parsedData.data.description,
				order: parsedData.data.order,
				setId: parsedData.data.setId,
				elementId: parsedData.data.elementId,
				imageUrl: parsedData.data.imageUrl ?? '', // Используем дефолтное значение
				imageChecked: parsedData.data.imageChecked,
				imageHeight: parsedData.data.imageHeight,
				imageWidth: parsedData.data.imageWidth,
				// pageUrl: parsedData.data.pageUrl,
			},
		});
		return updatedStep;
	} catch (error) {
		console.error('Error updating step:', error);
		throw new Error('Error updating step in database');
	}
}

export async function updateStepsOrder(
	updatedSteps: { id: number; order: number }[]
) {
	try {
		const updatePromises = updatedSteps.map(step =>
			prisma.step.update({
				where: { id: step.id },
				data: { order: step.order },
			})
		);
		await Promise.all(updatePromises);
		return { success: true };
	} catch (error) {
		console.error('Error updating step order:', error);
		throw new Error('Cant update steps order');
	}
}
