'use server';

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
