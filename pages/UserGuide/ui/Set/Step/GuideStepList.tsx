'use client';

import { Button } from '@/components/ui/button';
import { Step } from '@prisma/client';
import { Reorder } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
	deleteStep,
	getStepsBySetId,
	updateStepsOrder,
} from '../../../data/step';
import { GuideStep } from './GuideStep';
import { StepModal } from './StepModal';

export const GuideStepsList = ({ setId }: { setId: number }) => {
	const [steps, setSteps] = useState<Step[]>([]);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [selectedStep, setSelectedStep] = useState<Step | null>(null);

	useEffect(() => {
		const fetchSteps = async () => {
			try {
				const stepsData = await getStepsBySetId(setId);
				setSteps(stepsData);
			} catch (error) {
				console.error('Ошибка при получении шагов:', error);
			}
		};

		fetchSteps();
	}, [setId]);
	// if (steps.length === 0) {
	// 	return <p className='text-gray-500'>No steps available.</p>;
	// }
	const closeModal = () => {
		setSelectedStep(null); // Сбрасываем выбранный шаг
		setIsModalOpen(false); // Закрываем модальное окно
	};

	const handleStepCreated = (newStep: Step) => {
		const updatedSteps = steps.map(step => {
			if (step.order >= newStep.order) {
				return { ...step, order: step.order + 1 };
			}
			return step;
		});
		const finalSteps = [...updatedSteps, newStep].sort(
			(a, b) => a.order - b.order
		);

		setSteps(finalSteps);

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
		const updatedSteps = steps.map(step =>
			step.id === updatedStep.id ? updatedStep : step
		);
		setSteps(updatedSteps);
	};

	const handleStepDeleted = async (stepId: number) => {
		try {
			await deleteStep(stepId);

			const updatedSteps = steps
				.filter(step => step.id !== stepId)
				.map((step, index) => ({ ...step, order: index + 1 }));
			setSteps(updatedSteps);

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
		setSteps(updatedSteps);
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
					className='text-white px-4 py-2 rounded-md'
					onClick={() => {
						setSelectedStep(null); // Очищаем выбранный шаг для создания нового
						setIsModalOpen(true);
					}}
				>
					Add Lesson
				</Button>
			</div>

			{steps.length === 0 ? (
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

			<StepModal
				setId={setId}
				step={selectedStep} // Передаем выбранный шаг или null для создания
				isOpen={isModalOpen}
				onClose={closeModal}
				onStepCreated={handleStepCreated}
				onStepEdited={handleStepUpdated}
			/>
		</div>
	);
};
