'use client';

import { Step } from '@prisma/client'
import React, { useState } from 'react'
import StepHeader from './StepHeader'

interface GuideStepProps {
	step: Step;
	onStepDeleted: (stepId: number) => void;
	onStepEdited: (step: Step) => void;
}

export const GuideStep = ({
	step,
	onStepDeleted,
	onStepEdited,
}: GuideStepProps) => {
	const [isExpanded, setIsExpanded] = useState<boolean>(false);

	const toggleExpand = () => {
		setIsExpanded(prev => !prev);
	};

	const handleDelete = () => {
		onStepDeleted(step.id);
	};
	const handleEdit = () => {
		onStepEdited(step); // Передаем шаг для редактирования
	};
	return (
		<div className='mb-4'>
			<StepHeader
				title={step.title}
				order={step.order}
				isExpanded={isExpanded}
				onToggleExpand={toggleExpand}
				onStepDeleted={handleDelete}
				onStepEdited={handleEdit}
			/>
			{/* Скрываем содержимое в свернутом состоянии, убирая padding и отступы */}
			<div
				className={`transition-all duration-300 ease-in-out overflow-hidden ${
					isExpanded ? 'max-h-screen p-4' : 'max-h-0 p-0'
				}`}
			>
				{/* Отображаем содержимое только если isExpanded равно true */}
				{isExpanded && (
					<div className='ml-8 mt-2 rounded'>
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
				)}
			</div>
		</div>
	);
};
