import { create } from 'zustand';
import { fetchUrls as fetchUrlsAction } from '../../../pages/Urls/data/url'; // Импортируем серверный экшен
import { Url } from '../../../pages/Urls/types/types'; // Импортируем тип URL

interface UrlStore {
	urls: Url[];
	fetchUrls: () => Promise<void>;
}

export const useUrlStore = create<UrlStore>(set => ({
	urls: [],
	fetchUrls: async () => {
		try {
			const data = await fetchUrlsAction(); // Вызываем серверный экшен напрямую
			set({ urls: data });
		} catch (error) {
			console.error('Ошибка при загрузке URL:', error);
		}
	},
}));
