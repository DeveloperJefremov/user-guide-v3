'use client';

import { Button } from '@/components/ui/button';
import { Step } from '@prisma/client';
import { Reorder } from 'framer-motion';
import React, { useState } from 'react';
import {
	deleteStep,
	// getStepsBySetId,
	updateStepsOrder,
} from '../../../data/step';
import { GuideStep } from './GuideStep';
import { StepModal } from './StepModal';

interface GuideStepsListProps {
	steps: Step[];
	setId: number;
}

export const GuideStepsList = ({ steps, setId }: GuideStepsListProps) => {
	const [localSteps, setLocalSteps] = useState<Step[]>(steps);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [selectedStep, setSelectedStep] = useState<Step | null>(null);

	// useEffect(() => {
	// 	const fetchSteps = async () => {
	// 		try {
	// 			const stepsData = await getStepsBySetId(setId);
	// 			setSteps(stepsData);
	// 		} catch (error) {
	// 			console.error('Ошибка при получении шагов:', error);
	// 		}
	// 	};

	// 	fetchSteps();
	// }, [setId]);

	const handleStepCreated = (newStep: Step) => {
		const updatedSteps = localSteps.map(step => {
			if (step.order >= newStep.order) {
				return { ...step, order: step.order + 1 };
			}
			return step;
		});
		const finalSteps = [...updatedSteps, newStep].sort(
			(a, b) => a.order - b.order
		);

		setLocalSteps(finalSteps);

		try {
			updateStepsOrder(
				finalSteps.map(step => ({ id: step.id, order: step.order }))
			);
		} catch (error) {
			console.error('Ошибка при обновлении порядка шагов на сервере:', error);
		}
	};

	const handleStepEdited = (step: Step) => {
		setSelectedStep(step);
		setIsModalOpen(true);
	};

	const handleStepUpdated = (updatedStep: Step) => {
		setLocalSteps(prevSteps =>
			prevSteps.map(step => (step.id === updatedStep.id ? updatedStep : step))
		);
		setIsModalOpen(false);
		setSelectedStep(null);
	};

	const handleStepDeleted = async (stepId: number) => {
		try {
			await deleteStep(stepId);

			const updatedSteps = localSteps
				.filter(step => step.id !== stepId)
				.map((step, index) => ({ ...step, order: index + 1 }));
			setLocalSteps(updatedSteps);

			await updateStepsOrder(
				updatedSteps.map(step => ({ id: step.id, order: step.order }))
			);
		} catch (error) {
			console.error('Ошибка при удалении шага:', error);
		}
	};

	const handleReorder = async (newOrder: Step[]) => {
		const updatedSteps = newOrder.map((step, index) => ({
			...step,
			order: index + 1,
		}));
		setLocalSteps(updatedSteps);
		try {
			updatedSteps.map(step => ({ id: step.id, order: step.order }));
			await updateStepsOrder(
				updatedSteps.map(step => ({ id: step.id, order: step.order }))
			);
		} catch (error) {
			console.error('Ошибка при обновлении порядка шагов на сервере:', error);
		}
	};

	return (
		<div className='mt-4'>
			<div className='flex justify-between items-center mb-2'>
				<h3 className='text-lg font-semibold'>Guide Steps List:</h3>
				<Button
					className=' text-white px-4 py-2 rounded-md'
					onClick={() => setIsModalOpen(true)}
				>
					Add Lesson
				</Button>
			</div>

			{localSteps.length === 0 ? (
				<p>No steps available.</p>
			) : (
				<Reorder.Group
					axis='y'
					values={steps}
					onReorder={handleReorder}
					as='ul'
					className='space-y-4'
				>
					{steps.map(step => (
						<Reorder.Item
							key={step.id}
							value={step}
							as='li'
							className='border p-4 rounded-lg shadow-sm'
						>
							<GuideStep
								step={step}
								onStepDeleted={handleStepDeleted}
								onStepEdited={handleStepEdited}
							/>
						</Reorder.Item>
					))}
				</Reorder.Group>
			)}
			{isModalOpen && (
				<StepModal
					setId={setId}
					isOpen={isModalOpen}
					onClose={() => {
						setIsModalOpen(false);
						setSelectedStep(null);
					}}
					onStepCreated={handleStepCreated}
					onStepUpdated={handleStepUpdated}
					initialData={selectedStep}
					stepId={selectedStep?.id}
				/>
			)}
		</div>
	);
};
