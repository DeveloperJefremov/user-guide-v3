'use client';

import { Step } from '@prisma/client';
import React from 'react';
import StepFooter from './StepFooter';
import StepHeader from './StepHeader';

interface GuideStepProps {
	step: Step;
}

export const GuideStep = ({ step }: GuideStepProps) => {
	return (
		<div>
			<StepHeader />
			<div className='ml-8 mt-2 p-4 border-l-2 border-gray-300 bg-gray-50 rounded'>
				<h3 className='text-lg font-semibold'>{step.title}</h3>
				{step.description && (
					<p className='text-gray-700 mt-1'>{step.description}</p>
				)}
				{/* При необходимости добавьте дополнительные поля */}
			</div>

			<StepFooter />
		</div>
	);
};
