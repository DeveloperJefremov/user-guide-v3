'use server';
import { SetWithSteps } from '@/lib/types/types';
import { createSetSchema } from '@/lib/zod/setSchema';
import { prisma } from '@/prisma/prisma-client';
import { Status } from '@prisma/client';

export async function getGuideSets(): Promise<SetWithSteps[]> {
	const sets = await prisma.set.findMany({
		where: {
			status: { in: ['EMPTY', 'DRAFT', 'UNDER_REVIEW', 'COMPLETED'] },
		},
		orderBy: {
			order: 'asc', // Упорядочиваем сеты по полю `order`
		},
		include: {
			steps: {
				orderBy: {
					order: 'asc', // Упорядочиваем степы по полю `order`
				},
			}, // Если вам нужны связанные шаги
		},
	});
	return sets;
}

export async function createSet(data: SetWithSteps): Promise<SetWithSteps> {
	const parsedData = createSetSchema.safeParse(data);

	if (!parsedData.success) {
		throw new Error(parsedData.error.errors.map(e => e.message).join(', '));
	}

	const newSet = await prisma.set.create({
		data: {
			title: parsedData.data.title,
			pageUrl: parsedData.data.pageUrl,
			// userId: 1,
			status: parsedData.data.status,
			isCompleted: parsedData.data.isCompleted || false,
		},
		include: {
			steps: {
				orderBy: {
					order: 'asc',
				},
			},
		},
	});

	return newSet;
}

export async function deleteSet(setId: number) {
	try {
		await prisma.set.delete({
			where: { id: setId },
		});
	} catch (error) {
		throw new Error('Не удалось удалить сет');
	}
}

// Обновление существующего сета
export async function updateSet(
	setId: number,
	data: SetWithSteps
): Promise<SetWithSteps> {
	const parsedData = createSetSchema.safeParse(data);

	if (!parsedData.success) {
		throw new Error(parsedData.error.errors.map(e => e.message).join(', '));
	}

	try {
		const updatedSet = await prisma.set.update({
			where: { id: setId },
			data: {
				title: parsedData.data.title,
				status: parsedData.data.status,
				pageUrl: parsedData.data.pageUrl,
				isCompleted: parsedData.data.isCompleted || false,
			},
			include: {
				steps: {
					orderBy: {
						order: 'asc',
					},
				},
			},
		});
		return updatedSet;
	} catch (error) {
		throw new Error('Не удалось обновить сет');
	}
}

export async function updateSetStatus(setId: number, newStatus: Status) {
	try {
		const updatedSet = await prisma.set.update({
			where: { id: setId },
			data: {
				status: newStatus,
				isCompleted: newStatus === Status.COMPLETED ? true : false,
			},
		});
		return updatedSet;
	} catch (error) {
		throw new Error('Не удалось обновить статус сета');
	}
}

export async function updateSetsOrder(
	updatedSets: { id: number; order: number }[]
) {
	try {
		const updatePromises = updatedSets.map(set =>
			prisma.set.update({
				where: { id: set.id },
				data: { order: set.order },
			})
		);
		await Promise.all(updatePromises);
		return { success: true };
	} catch (error) {
		console.error('Ошибка при обновлении порядка сетов:', error);
		throw new Error('Не удалось обновить порядок сетов');
	}
}
