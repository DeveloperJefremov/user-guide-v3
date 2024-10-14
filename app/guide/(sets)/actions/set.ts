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
