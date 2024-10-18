'use server';
import { SetWithSteps } from '@/lib/types/types';
import { CreateSetInput, createSetSchema } from '@/lib/zod/setSchema';
import { prisma } from '@/prisma/prisma-client';

export async function getGuideSets(): Promise<SetWithSteps[]> {
	const sets = await prisma.set.findMany({
		where: {
			status: { in: ['EMPTY', 'DRAFT', 'UNDER_REVIEW', 'COMPLETED'] },
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
			userId: 1, // Замените на реальный userId после настройки аутентификации
			status: 'EMPTY', // Или другой статус по умолчанию
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
				// Добавьте другие поля, если необходимо
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
