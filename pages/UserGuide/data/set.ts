'use server';

import { CreateSetInput, createSetSchema } from '@/lib/zod/setSchema';
import { prisma } from '@/prisma/prisma-client';

export async function getGuideSets() {
	const sets = await prisma.set.findMany({
		where: {
			status: 'EMPTY', // Или другой статус, который вы хотите получить
		},
		include: {
			steps: true, // Если вам нужны связанные шаги
		},
	});
	return sets;
}

export async function createSet(data: CreateSetInput) {
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
export async function updateSet(setId: number, data: CreateSetInput) {
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
		});
		return updatedSet;
	} catch (error) {
		throw new Error('Не удалось обновить сет');
	}
}
