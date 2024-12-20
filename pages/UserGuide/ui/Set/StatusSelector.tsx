'use client';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Set, Status } from '@prisma/client';
import React, { useState } from 'react';
import { updateSet } from '../../data/set';

interface StatusSelectorProps {
	currentStatus: Status;
	onChangeStatus: (newStatus: Status) => void;
	isToggleOn: boolean;
	setIsToggleOn: (isToggleOn: boolean) => void;
	initialData?: Set | null;
	// onToggleStatusChange?: (isToggleOn: boolean) => void;
	isEditing?: boolean;
}

export const StatusSelector = ({
	currentStatus,
	onChangeStatus,
	isToggleOn,
	setIsToggleOn,
	// initialData,
	// onToggleStatusChange,
	isEditing = true,
}: StatusSelectorProps): JSX.Element => {
	const [status, setStatus] = useState<Status>(currentStatus);
	// const [isToggleOn, setIsToggleOn] = useState<boolean>(false);

	const statuses: Status[] = ['EMPTY', 'DRAFT', 'UNDER_REVIEW', 'COMPLETED'];

	const handleStatusChange = (value: string) => {
		const newStatus = value as Status;
		setStatus(newStatus);
		onChangeStatus(newStatus);
		if (newStatus !== 'COMPLETED') {
			setIsToggleOn(false); // Сбрасываем состояние переключателя, если статус не COMPLETED
		}
	};

	const handleToggleClick = () => {
		setIsToggleOn(!isToggleOn);
	};

	// const handleToggleClick = async () => {
	// 	setIsToggleOn(!isToggleOn);
	// 	// Если есть `initialData`, обновляем его в базе данных
	// 	if (isEditing && initialData) {
	// 		try {
	// 			await updateSet(initialData.id, {
	// 				...initialData,
	// 				isCompleted: !isToggleOn,
	// 				steps: [],
	// 			});
	// 		} catch (error) {
	// 			console.error(
	// 				'Ошибка при обновлении isCompleted в базе данных:',
	// 				error
	// 			);
	// 		}
	// 	}
	// };

	return (
		<div className='flex items-center ml-4'>
			<Select
				value={status}
				onValueChange={handleStatusChange}
				disabled={!isEditing}
			>
				<SelectTrigger className='w-40'>
					<SelectValue placeholder='Select status' />
				</SelectTrigger>
				<SelectContent>
					{statuses.map(statusOption => (
						<SelectItem key={statusOption} value={statusOption}>
							{statusOption}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{status === 'COMPLETED' && (
				<Button
					type='button'
					variant='outline'
					size='sm'
					className={cn(
						'ml-2',
						isToggleOn
							? 'bg-green-500 hover:bg-green-500 text-white'
							: 'bg-gray-200 text-gray-700'
					)}
					onClick={handleToggleClick}
				>
					{isToggleOn ? 'On' : 'Off'}
				</Button>
			)}
		</div>
	);
};
