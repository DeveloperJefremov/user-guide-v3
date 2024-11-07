export enum Role {
	ADMIN,
	USER,
}

// Интерфейс для модели User
export interface User {
	id: number;
	name: string;
	username: string;
	password: string; // Учтите безопасность при работе с паролями
	role: Role;
	createdAt: Date;
	updatedAt: Date;

	// sets?: Set[]; // Массив наборов, принадлежащих пользователю
}
