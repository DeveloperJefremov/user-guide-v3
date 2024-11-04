'use client';

import { Button } from '@/components/ui/button';
import { Step } from '@prisma/client';
import { Reorder } from 'framer-motion';
import React, { useState } from 'react';
import { deleteStep, updateStepsOrder } from '../../../data/step';
import { StepHighlighter } from '../StepHighlighter';
import { GuideStep } from './GuideStep';
import { StepModal } from './StepModal';

interface GuideStepsListProps {
	steps: Step[];
	setId: number;
	isLaunching: boolean;
	setIsLaunching: (isLaunching: boolean) => void;
	deleteImageFromStorage: (imageUrl: string) => void;
}

export const GuideStepsList = ({
	steps,
	setId,
	isLaunching,
	setIsLaunching,
	deleteImageFromStorage,
}: GuideStepsListProps) => {
	const [localSteps, setLocalSteps] = useState<Step[]>(steps);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [selectedStep, setSelectedStep] = useState<Step | null>(null);
	const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

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
			const stepToDelete = localSteps.find(step => step.id === stepId);

			if (stepToDelete?.imageUrl) {
				await deleteImageFromStorage(stepToDelete.imageUrl);
			}

			// Удаляем шаг из базы данных
			await deleteStep(stepId);

			// Обновляем список шагов и их порядок
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
		const reorderedSteps = newOrder.map((step, index) => ({
			...step,
			order: index + 1,
		}));
		setLocalSteps(reorderedSteps);

		try {
			await updateStepsOrder(
				reorderedSteps.map(step => ({ id: step.id, order: step.order }))
			);
		} catch (error) {
			console.error('Ошибка при обновлении порядка шагов на сервере:', error);
		}
	};

	const goToNextStep = () => {
		if (currentStepIndex < localSteps.length - 1) {
			setCurrentStepIndex(prev => prev + 1);
		}
	};

	const goToPrevStep = () => {
		if (currentStepIndex > 0) {
			setCurrentStepIndex(prev => prev - 1);
		}
	};

	const maxOrder =
		localSteps.length > 0 ? Math.max(...localSteps.map(step => step.order)) : 0;

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
					values={localSteps}
					onReorder={handleReorder}
					as='ul'
					className='space-y-4'
				>
					{localSteps.map(step => (
						<Reorder.Item
							key={step.id}
							value={step}
							as='li'
							className='border p-4 rounded-lg shadow-sm'
						>
							<GuideStep
								setId={setId}
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
					maxOrder={maxOrder}
				/>
			)}

			{isLaunching && (
				<StepHighlighter
					steps={localSteps} // передаем актуализированный список шагов
					setIsLaunching={setIsLaunching}
					currentStepIndex={currentStepIndex}
					goToNextStep={goToNextStep}
					goToPrevStep={goToPrevStep}
				/>
			)}
		</div>
	);
};
