// lib/hooks/useLocalStorage.ts

import { useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
	// Состояние для хранения значения
	const [storedValue, setStoredValue] = useState<T>(initialValue);

	useEffect(() => {
		try {
			const item = window.localStorage.getItem(key);
			if (item) {
				setStoredValue(JSON.parse(item));
			}
		} catch (error) {
			console.error('Error reading from localStorage', error);
		}
	}, [key]);

	const setValue = (value: T) => {
		try {
			setStoredValue(value);
			window.localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error('Error writing to localStorage', error);
		}
	};

	const removeValue = () => {
		try {
			window.localStorage.removeItem(key);
			setStoredValue(initialValue);
		} catch (error) {
			console.error('Error removing from localStorage', error);
		}
	};

	return [storedValue, setValue, removeValue] as const;
}
