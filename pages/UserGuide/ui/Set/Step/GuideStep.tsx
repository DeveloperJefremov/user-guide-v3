'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Step } from '@prisma/client';
import React, { useState } from 'react';
import { StepCard } from './StepCard';
import StepHeader from './StepHeader';

interface GuideStepProps {
	step: Step;
	setId: number;
	onStepDeleted: (stepId: number) => void;
	onStepEdited: (step: Step) => void;
}

export const GuideStep = ({
	step,
	setId,
	onStepDeleted,
	onStepEdited,
}: GuideStepProps) => {
	const [isExpanded, setIsExpanded] = useState<boolean>(false);

	const toggleExpand = () => {
		setIsExpanded(prev => !prev);
	};

	const clearLocalStorageForStep = (setId: number, stepId: number) => {
		const editKey = `editStep_${setId}_${stepId}`;
		const previewKey = `previewUrl_${setId}_${stepId}`;

		localStorage.removeItem(editKey);
		localStorage.removeItem(previewKey);
	};

	const handleDelete = () => {
		onStepDeleted(step.id);
		clearLocalStorageForStep(setId, step.id);
	};
	const handleEdit = () => {
		onStepEdited(step);
	};

	return (
		<Card className='mb-4'>
			<CardHeader>
				<StepHeader
					title={step.title}
					order={step.order}
					isExpanded={isExpanded}
					onToggleExpand={toggleExpand}
					onStepDeleted={handleDelete}
					onStepEdited={handleEdit}
				/>
			</CardHeader>
			<div
				className={`transition-all duration-300 ease-in-out overflow-hidden ${
					isExpanded ? 'max-h-screen p-4' : 'max-h-0 p-0'
				}`}
			>
				{isExpanded && (
					<StepCard
						description={step.description ?? undefined}
						elementId={step.elementId}
						imageUrl={step.imageUrl ?? undefined}
						imageWidth={step.imageWidth ?? undefined}
						imageHeight={step.imageHeight ?? undefined}
					/>
				)}
			</div>
		</Card>
	);
};
