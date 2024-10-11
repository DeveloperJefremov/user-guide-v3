// types.ts

// Перечисления
export enum Status {
	EMPTY = 'EMPTY',
	DRAFT = 'DRAFT',
	UNDERREVIEW = 'UNDERREVIEW',
	COMPLETED = 'COMPLETED',
}

export enum Role {
	ADMIN = 'ADMIN',
	USER = 'USER',
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

	sets?: Set[]; // Массив наборов, принадлежащих пользователю
}

// Интерфейс для модели Set
export interface Set {
	id: number;
	title: string;
	status: Status;
	createdAt: Date;
	updatedAt: Date;

	userId: number;
	user?: User; // Пользователь, которому принадлежит набор

	steps?: Step[]; // Массив шагов в наборе
}

// Интерфейс для модели Step
export interface Step {
	id: number;
	setId: number;
	set?: Set; // Набор, к которому принадлежит шаг

	title: string;
	description?: string;
	order: number;
	elementId: string;
	imageUrl?: string;
	imageChecked: boolean;
	imageHeight?: number;
	imageWidth?: number;
	pageUrl: string;
	createdAt: Date;
	updatedAt: Date;
}

export type ModeType = 'CREATE' | 'EDIT' | 'DISPLAY' | 'EXECUTE';
