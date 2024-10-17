import { Button } from '@/components/ui/button';
import { MinusIcon, PlusIcon } from 'lucide-react';
import React from 'react';

interface StepHeaderProps {
	title: string;
	order: number;
	isExpanded: boolean;
	stepId: number;
	onToggleExpand: () => void;
	onStepDeleted: (stepId: number) => void;
}

const StepHeader = ({
	title,
	order,
	isExpanded,
	stepId,
	onToggleExpand,
	onStepDeleted,
}: StepHeaderProps) => {
	const handleDelete = () => {
		onStepDeleted(stepId); // Вызываем коллбэк удаления
	};

	return (
		<div className='mb-4 flex justify-between items-center'>
			<div>
				<h2 className='text-xl font-bold'>{title}</h2>
				<p className='text-gray-500'>Order: {order}</p>
			</div>
			<div className='flex space-x-2'>
				<Button
					variant='default'
					//  onClick={handleEdit}
				>
					Edit
				</Button>
				<Button variant='destructive' onClick={handleDelete}>
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
