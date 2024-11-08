import { Button } from '@/components/ui/button';
import { Set, Status } from '@prisma/client';
import { MinusIcon, PlusIcon } from 'lucide-react';
import React from 'react';
import { StatusBadge } from './StatusBadge';

interface SetHeaderProps {
	setTitle: string;
	setId: number;
	status: Status;
	pageUrl?: {
		// делаем `pageUrl` необязательным объектом
		status: 'ACTIVE' | 'INACTIVE' | 'HIDDEN' | 'ARCHIVED' | 'INITIAL';
		id: number;
		url: string;
		description: { id: number; value: string; order: number }[] | null;
		validFrom: Date;
		validTo: Date;
	} | null;
	onDelete: (id: number) => void;
	onEdit: (set: Set) => void;
	isCompleted?: boolean;
	isExpanded: boolean;
	onToggleExpand: () => void;
}

export const SetHeader = ({
	setTitle,
	setId,
	status,
	isCompleted,
	pageUrl, // Принимаем pageUrl
	onDelete,
	onEdit,

	isExpanded,
	onToggleExpand,
}: SetHeaderProps) => {
	const handleEdit = () => {
		onEdit({
			id: setId,
			title: setTitle,
			pageUrlId: pageUrl?.id || null,
			status: status,
			order: 0,
			createdAt: new Date(),
			updatedAt: new Date(),
			userId: 1,
			isCompleted: false,
		});
	};

	// const handleStatusChange = async (newStatus: Status) => {
	// 	try {
	// 		await updateSetStatus(setId, newStatus);
	// 		if (onChangeStatus) {
	// 			onChangeStatus(setId, newStatus);
	// 		}
	// 	} catch (error) {
	// 		console.error('Ошибка при изменении статуса:', error);
	// 	}
	// };

	return (
		<header className='p-4 flex justify-between items-center'>
			<div className='flex flex-col'>
				<div className='flex items-center'>
					<h2 className='text-xl font-bold mr-3'>{setTitle}</h2>
					<StatusBadge status={status} isToggleOn={isCompleted ?? false} />
				</div>
				{pageUrl && <p className='text-sm text-gray-500 mt-2'>{pageUrl.url}</p>}
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
