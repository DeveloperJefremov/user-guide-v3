// types.ts

import { Status } from '@prisma/client';

// Перечисления
// export enum Status {
// 	EMPTY,
// 	DRAFT,
// 	UNDER_REVIEW,
// 	COMPLETED,
// }

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

	sets?: Set[]; // Массив наборов, принадлежащих пользователю
}

// Интерфейс для модели Set
export interface Set {
	id: number;
	title: string;
	status: Status;
	order: number;
	createdAt: Date;
	updatedAt: Date;
	userId: number;
	user?: User; // Пользователь, которому принадлежит набор
	steps?: Step[]; // Массив шагов в наборе
}

export interface SetWithSteps extends Set {
	steps: Step[];
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
	pageUrl: string;
	createdAt: Date;
	updatedAt: Date;
	// set?: Set;
}

export type ModeType = 'CREATE' | 'EDIT' | 'DISPLAY' | 'EXECUTE';
