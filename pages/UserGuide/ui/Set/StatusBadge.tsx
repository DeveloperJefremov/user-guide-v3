import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Status } from '@prisma/client';
import { CheckCircle, Edit3, FileText, Hourglass } from 'lucide-react';
import React from 'react';

interface StatusBadgeProps {
	status: Status;
	isToggleOn: boolean;
	// onToggle: () => void;
}

const statusConfig = {
	EMPTY: {
		label: 'Empty',
		styles: 'bg-gray-200 text-gray-800',
		icon: <FileText className='w-4 h-4 mr-1' />,
	},
	DRAFT: {
		label: 'Draft',
		styles: 'bg-yellow-200 text-yellow-800',
		icon: <Edit3 className='w-4 h-4 mr-1' />,
	},
	UNDER_REVIEW: {
		label: 'Under Review',
		styles: 'bg-blue-200 text-blue-800',
		icon: <Hourglass className='w-4 h-4 mr-1' />,
	},
	COMPLETED: {
		label: 'Completed',
		styles: 'bg-green-200 text-green-800',
		icon: <CheckCircle className='w-4 h-4 mr-1' />,
	},
};

export const StatusBadge = ({
	status,
	isToggleOn,
}: // onToggle,
StatusBadgeProps) => {
	const { label, styles, icon } = statusConfig[status];

	return (
		<div className='flex items-center space-x-2'>
			<Badge
				className={`${styles} flex items-center px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm transition-all duration-200 transform hover:scale-105`}
			>
				{icon}
				<span>{label}</span>
			</Badge>
			{/* Индикатор On/Off для статуса COMPLETED */}
			{status === 'COMPLETED' && (
				<Button
					type='button'
					variant='outline'
					size='sm'
					className={cn(
						'ml-2',
						isToggleOn ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
					)}
					// onClick={onToggle}
				>
					{isToggleOn ? 'On' : 'Off'}
				</Button>
			)}
		</div>
	);
};
