export type Role = 'ADMIN' | 'TECH' | 'USER'; // Типы ролей на основе enum Role в Prisma
export type Status = 'OPEN' | 'STARTED' | 'CLOSED'; // Типы статусов на основе enum Status в Prisma
export type ModeType = 'CREATE' | 'EDIT' | 'DISPLAY' | 'EXECUTE';
export type User = {
	id: number;
	name: string;
	username: string;
	password: string;
	role: Role;
	createdAt: Date;
	updatedAt: Date;
	sets: Set[]; // Реляция с моделью Set
};

export type Set = {
	id: number;
	title: string;
	status: Status;
	steps: Step[]; // Реляция с моделью Step
	createdAt: Date;
	updatedAt: Date;
	user?: User; // Пользователь может быть опциональным
	userId?: number;
};

export type Step = {
	id: number;
	setId: number; // Внешний ключ на Set
	set: Set; // Реляция с моделью Set
	title: string;
	description?: string; // Описание опционально
	order: number;
	elementId: string;
	imageUrl: string;
	imageChecked: boolean;
	imageHeight: number;
	imageWidth: number;
	pageUrl: string;
	createdAt: Date;
	updatedAt: Date;
};
