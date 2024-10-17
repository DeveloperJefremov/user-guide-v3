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
			<StepHeader title={step.title} order={step.order} />
			<div className='ml-8 mt-2 p-4  rounded'>
				{step.description && (
					<p className='text-gray-700 mt-1'>{step.description}</p>
				)}

				<p className='text-gray-500 mt-2'>Element ID: {step.elementId}</p>
				<p className='text-gray-500'>Page URL: {step.pageUrl}</p>

				{step.imageUrl && (
					<div className='mt-2'>
						<p className='text-gray-500'>Image URL: {step.imageUrl}</p>
						{step.imageChecked && (
							<img
								src={step.imageUrl}
								alt='Step image'
								width={step.imageWidth || 200}
								height={step.imageHeight || 200}
								className='mt-2'
							/>
						)}
					</div>
				)}

				<p className='text-gray-500 mt-2'>
					Created at: {new Date(step.createdAt).toLocaleDateString()}
				</p>
				<p className='text-gray-500'>
					Updated at: {new Date(step.updatedAt).toLocaleDateString()}
				</p>
			</div>

			<StepFooter />
		</div>
	);
};
