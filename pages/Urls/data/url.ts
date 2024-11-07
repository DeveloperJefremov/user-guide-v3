import { prisma } from '@/prisma/prisma-client';
import { Url } from '../types/types';

/**
 * Создает новый URL-запись в базе данных
 * @param data - данные для создания нового URL
 * @returns созданный объект URL
 */
export async function createUrl(data: Url) {
	try {
		const newUrl = await prisma.url.create({
			data: {
				url: data.url,
				description: JSON.stringify(data.description), // Сериализация description
				validFrom: data.validFrom,
				validTo: data.validTo,
				status: data.status,
			},
		});
		return newUrl;
	} catch (error) {
		console.error('Ошибка при создании URL:', error);
		throw new Error('Ошибка при создании URL');
	}
}

/**
 * Удаляет URL по его идентификатору
 * @param id - идентификатор URL для удаления
 * @returns удаленный объект URL
 */
export async function deleteUrl(id: number) {
	try {
		const deletedUrl = await prisma.url.delete({
			where: {
				id,
			},
		});
		return deletedUrl;
	} catch (error) {
		console.error('Ошибка при удалении URL:', error);
		throw new Error('Ошибка при удалении URL');
	}
}

/**
 * Обновляет данные существующего URL
 * @param data - объект URL с обновленными данными
 * @returns обновленный объект URL
 */
export async function editUrl(data: Url) {
	try {
		const updatedUrl = await prisma.url.update({
			where: {
				id: data.id,
			},
			data: {
				url: data.url,
				description: JSON.stringify(data.description), // Сериализация description
				validFrom: data.validFrom,
				validTo: data.validTo,
				status: data.status,
			},
		});
		return updatedUrl;
	} catch (error) {
		console.error('Ошибка при обновлении URL:', error);
		throw new Error('Ошибка при обновлении URL');
	}
}

/**
 * Получает список всех URL из базы данных
 * @returns массив объектов URL
 */
export async function fetchUrls() {
	try {
		const urls = await prisma.url.findMany();

		// Десериализация description из JSON-строки в массив объектов
		return urls.map(url => ({
			...url,
			description: url.description ? JSON.parse(url.description) : null,
		}));
	} catch (error) {
		console.error('Ошибка при получении списка URL:', error);
		throw new Error('Ошибка при получении списка URL');
	}
}

// import { prisma } from '@/prisma/prisma-client';
// import { Prisma, Url } from '@prisma/client';

// // Экшен для получения всех URL-ов
// export const fetchUrls = async (): Promise<Url[]> => {
// 	try {
// 		const urls = await prisma.url.findMany();
// 		return urls;
// 	} catch (error) {
// 		console.error('Error fetching URLs:', error);
// 		throw new Error('Failed to fetch URLs');
// 	}
// };
// // Экшен для создания нового URL
// export const createUrl = async (
// 	data: Omit<Prisma.UrlCreateInput, 'id'>
// ): Promise<Url> => {
// 	try {
// 		const newUrl = await prisma.url.create({
// 			data,
// 		});
// 		return newUrl;
// 	} catch (error) {
// 		console.error('Error creating URL:', error);
// 		throw new Error('Failed to create URL');
// 	}
// };

// // Экшен для удаления URL по ID
// export const deleteUrl = async (id: number): Promise<void> => {
// 	try {
// 		await prisma.url.delete({
// 			where: { id },
// 		});
// 	} catch (error) {
// 		console.error('Error deleting URL:', error);
// 		throw new Error('Failed to delete URL');
// 	}
// };

// // Экшен для редактирования (обновления) URL
// export const editUrl = async (
// 	id: number,
// 	data: Prisma.UrlUpdateInput
// ): Promise<Url> => {
// 	try {
// 		const updatedUrl = await prisma.url.update({
// 			where: { id },
// 			data,
// 		});
// 		return updatedUrl;
// 	} catch (error) {
// 		console.error('Error updating URL:', error);
// 		throw new Error('Failed to update URL');
// 	}
// };
