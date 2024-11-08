// types.ts

import { Url } from '@/pages/Urls/types/types';
import { Status } from '@prisma/client';

// Перечисления
// export enum Status {
// 	EMPTY,
// 	DRAFT,
// 	UNDER_REVIEW,
// 	COMPLETED,
// }

// export enum Role {
// 	ADMIN,
// 	USER,
// }

// // Интерфейс для модели User
// export interface User {
// 	id: number;
// 	name: string;
// 	username: string;
// 	password: string; // Учтите безопасность при работе с паролями
// 	role: Role;
// 	createdAt: Date;
// 	updatedAt: Date;

// 	sets?: Set[]; // Массив наборов, принадлежащих пользователю
// }

// Интерфейс для модели Set
export interface Set {
	id: number;
	title: string;
	pageUrlId: number | null; // Внешний ключ на Url
	status: Status;
	isCompleted: boolean;
	order: number;
	createdAt: Date;
	updatedAt: Date;
	userId: number | null;
	url?: Url; // Связанный объект Url
	pageUrl?: Url | null;
}

export interface SetWithSteps extends Set {
	steps: Step[];
	pageUrl?: Url | null;
}

// Интерфейс для модели Step
export interface Step {
	id: number;
	setId: number;
	title: string;
	description: string | null;
	order: number;
	elementId: string;
	imageUrl: string | null;
	imageChecked: boolean;
	imageHeight: number | null;
	imageWidth: number | null;
	// pageUrl: string;
	createdAt: Date;
	updatedAt: Date;
	// set?: Set;
}
