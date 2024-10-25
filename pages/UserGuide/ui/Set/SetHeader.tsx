import { Button } from '@/components/ui/button';
import { Set, Status } from '@prisma/client';
import { MinusIcon, PlusIcon } from 'lucide-react';
import React from 'react';
import { updateSetStatus } from '../../data/set';
import { StatusBadge } from './StatusBadge';
import { StatusSelector } from './StatusSelector';

interface SetHeaderProps {
	setTitle: string;
	setId: number;
	status: Status; // Добавляем текущий статус
	onDelete: (id: number) => void;
	onEdit: (set: Set) => void;
	onChangeStatus?: (id: number, newStatus: Status) => void; // Опциональный коллбек для изменения статуса
	isExpanded: boolean;
	onToggleExpand: () => void;
}

export const SetHeader = ({
	setTitle,
	setId,
	status,
	onDelete,
	onEdit,
	onChangeStatus,
	isExpanded,
	onToggleExpand,
}: SetHeaderProps) => {
	const handleEdit = () => {
		onEdit({
			id: setId,
			title: setTitle,
			status: status,
			order: 0,
			createdAt: new Date(),
			updatedAt: new Date(),
			userId: 1, // Замените на актуальный userId
			// steps: [],
		});
	};

	const handleStatusChange = async (newStatus: Status) => {
		// показываем индикатор загрузки
		try {
			await updateSetStatus(setId, newStatus); // обновляем статус в базе данных
			if (onChangeStatus) {
				onChangeStatus(setId, newStatus); // обновляем статус в UI
			}
		} catch (error) {
			console.error('Ошибка при изменении статуса:', error);
		}
	};
	return (
		<header className=' p-4 flex justify-between items-center'>
			<div className='flex items-center'>
				<h2 className='text-xl font-bold mr-3'>{setTitle}</h2>
				<StatusBadge status={status} />
			</div>
			<div className='flex space-x-2'>
				<Button variant='default' onClick={handleEdit}>
					Edit
				</Button>
				<Button variant='destructive' onClick={() => onDelete(setId)}>
					Delete
				</Button>
				<Button
					variant='ghost'
					onClick={onToggleExpand}
					aria-label={isExpanded ? 'Collapse set' : 'Expand set'}
				>
					{isExpanded ? (
						<MinusIcon className='w-5 h-5' />
					) : (
						<PlusIcon className='w-5 h-5' />
					)}
				</Button>
			</div>
		</header>
	);
};
