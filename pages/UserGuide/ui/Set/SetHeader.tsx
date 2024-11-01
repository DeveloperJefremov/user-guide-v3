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
	status: Status;
	pageUrl: string; // Добавляем pageUrl
	onDelete: (id: number) => void;
	onEdit: (set: Set) => void;
	onChangeStatus?: (id: number, newStatus: Status) => void;
	isExpanded: boolean;
	onToggleExpand: () => void;
	isToggleOn?: boolean;
}

export const SetHeader = ({
	setTitle,
	setId,
	status,
	pageUrl, // Принимаем pageUrl
	onDelete,
	onEdit,
	onChangeStatus,
	isExpanded,
	onToggleExpand,
	isToggleOn = false,
}: SetHeaderProps) => {
	const handleEdit = () => {
		onEdit({
			id: setId,
			title: setTitle,
			pageUrl: pageUrl,
			status: status,
			order: 0,
			createdAt: new Date(),
			updatedAt: new Date(),
			userId: 1, // Замените на актуальный userId
		});
	};

	const handleStatusChange = async (newStatus: Status) => {
		try {
			await updateSetStatus(setId, newStatus);
			if (onChangeStatus) {
				onChangeStatus(setId, newStatus);
			}
		} catch (error) {
			console.error('Ошибка при изменении статуса:', error);
		}
	};

	return (
		<header className='p-4 flex justify-between items-center'>
			<div className='flex flex-col'>
				<div className='flex items-center'>
					<h2 className='text-xl font-bold mr-3'>{setTitle}</h2>
					<StatusBadge status={status} />
					{status === 'COMPLETED' && (
						<span
							className={`ml-2 font-medium ${
								isToggleOn ? 'text-green-500' : 'text-gray-500'
							}`}
						>
							{isToggleOn ? 'On' : 'Off'}
						</span>
					)}
				</div>
				<p className='text-sm text-gray-500 mt-2'>{pageUrl}</p>
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
