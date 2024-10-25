import { Badge } from '@/components/ui/badge';
import { Status } from '@prisma/client';
import { CheckCircle, Edit3, FileText, Hourglass } from 'lucide-react';
import React from 'react';

interface StatusBadgeProps {
	status: Status;
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

export const StatusBadge = ({ status }: StatusBadgeProps) => {
	const { label, styles, icon } = statusConfig[status];

	return (
		<Badge
			className={`${styles} flex items-center px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm transition-all duration-200 transform hover:scale-105`}
		>
			{icon}
			<span>{label}</span>
		</Badge>
	);
};
