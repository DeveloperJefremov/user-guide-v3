'use client';

import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils'; // Утилита для объединения классов, если используется
import { Status } from '@prisma/client';
import React, { useState } from 'react';

interface StatusSelectorProps {
	currentStatus: Status;
	onChangeStatus: (newStatus: Status) => void;
}

export const StatusSelector: React.FC<StatusSelectorProps> = ({
	currentStatus,
	onChangeStatus,
}) => {
	const [status, setStatus] = useState<Status>(currentStatus);
	const [isToggleOn, setIsToggleOn] = useState<boolean>(false);

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
		setIsToggleOn(prev => !prev);
	};

	return (
		<div className='flex items-center ml-4'>
			<Select value={status} onValueChange={handleStatusChange}>
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
					variant='outline'
					size='sm'
					className={cn(
						'ml-2',
						isToggleOn ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
					)}
					onClick={handleToggleClick}
				>
					{isToggleOn ? 'On' : 'Off'}
				</Button>
			)}
		</div>
	);
};
