import { Button } from '@/components/ui/button';
import { Set, Status } from '@prisma/client';
import React from 'react';
import { StatusSelector } from './StatusSelector';

interface SetHeaderProps {
	setTitle: string;
	setId: number;
	status: Status; // Добавляем текущий статус
	onDelete: (id: number) => void;
	onEdit: (set: Set) => void;
	onChangeStatus?: (id: number, newStatus: Status) => void; // Опциональный коллбек для изменения статуса
}

export const SetHeader = ({
	setTitle,
	setId,
	status,
	onDelete,
	onEdit,
	onChangeStatus,
}: SetHeaderProps) => {
	const handleEdit = () => {
		onEdit({
			id: setId,
			title: setTitle,
			status: status,
			createdAt: new Date(), // Используйте реальные данные
			updatedAt: new Date(),
			userId: 1, // Замените на актуальный userId
			// steps: [],
		});
	};

	const handleStatusChange = (newStatus: Status) => {
		if (onChangeStatus) {
			onChangeStatus(setId, newStatus);
		}
	};

	return (
		<header className='border-b p-4 flex justify-between items-center'>
			<div className='flex items-center'>
				<h2 className='text-xl font-bold'>{setTitle}</h2>
				<StatusSelector
					currentStatus={status}
					onChangeStatus={handleStatusChange}
				/>
			</div>
			<div className='flex space-x-2'>
				<Button variant='default' onClick={handleEdit}>
					Edit
				</Button>
				<Button variant='destructive' onClick={() => onDelete(setId)}>
					Delete
				</Button>
			</div>
		</header>
	);
};
