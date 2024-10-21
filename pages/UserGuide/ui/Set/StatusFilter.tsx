import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Status } from '@prisma/client';
import React from 'react';

interface StatusFilterProps {
	currentStatus: Status | 'ALL'; // Добавляем 'ALL' как вариант выбора
	onStatusChange: (status: Status | 'ALL') => void;
}

export const StatusFilter = ({
	currentStatus,
	onStatusChange,
}: StatusFilterProps) => {
	const statuses = [
		'ALL',
		'EMPTY',
		'DRAFT',
		'UNDER_REVIEW',
		'COMPLETED',
	] as const;

	const handleStatusChange = (value: Status | 'ALL') => {
		onStatusChange(value);
	};

	return (
		<div className='flex items-center mb-4'>
			<label htmlFor='status-filter' className='mr-2'>
				Filter by Status:
			</label>
			<Select value={currentStatus} onValueChange={handleStatusChange}>
				<SelectTrigger className='w-[180px]'>
					<SelectValue placeholder='Select status' />
				</SelectTrigger>
				<SelectContent>
					{statuses.map(status => (
						<SelectItem key={status} value={status}>
							{status}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};
