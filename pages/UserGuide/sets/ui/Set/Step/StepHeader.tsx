import React from 'react';

interface StepHeaderProps {
	title: string;
	order: number;
}

const StepHeader = ({ title, order }: StepHeaderProps) => {
	return (
		<div className='mb-4'>
			<h2 className='text-xl font-bold'>{title}</h2>
			<p className='text-gray-500'>Order: {order}</p>
		</div>
	);
};

export default StepHeader;
