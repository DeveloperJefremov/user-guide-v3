import { Button } from '@/components/ui/button';
import { MinusIcon, PlusIcon } from 'lucide-react';
import React from 'react';

interface StepHeaderProps {
	title: string;
	order: number;
	isExpanded: boolean;
	onToggleExpand: () => void;
	onStepDeleted: () => void;
	onStepEdited: () => void;
}

const StepHeader = ({
	title,
	order,
	isExpanded,
	onToggleExpand,
	onStepDeleted,
	onStepEdited,
}: StepHeaderProps) => {
	return (
		<div className='mb-4 flex justify-between items-center'>
			<div>
				<h2 className='text-xl font-bold'>{title}</h2>
				<p className='text-gray-500'>Order: {order}</p>
			</div>
			<div className='flex space-x-2'>
				<Button variant='default' onClick={onStepEdited}>
					Edit
				</Button>
				<Button variant='destructive' onClick={onStepDeleted}>
					Delete
				</Button>
				<Button
					variant='ghost'
					onClick={onToggleExpand}
					aria-label={isExpanded ? 'Collapse step' : 'Expand step'}
				>
					{isExpanded ? (
						<MinusIcon className='w-5 h-5' />
					) : (
						<PlusIcon className='w-5 h-5' />
					)}
				</Button>
			</div>
		</div>
	);
};

export default StepHeader;
