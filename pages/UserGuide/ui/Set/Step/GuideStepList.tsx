'use client';

import { Button } from '@/components/ui/button'
import { Step } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import { deleteStep, getStepsBySetId } from '../../../data/step'
import { GuideStep } from './GuideStep'
import { StepModal } from './StepModal'

export const GuideStepsList = ({ setId }: { setId: number }) => {
	const [steps, setSteps] = useState<Step[]>([]);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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

	const handleStepCreated = (newStep: Step) => {
		setSteps(prevSteps => [...prevSteps, newStep]); // Обновляем список шагов
	};

	const handleStepDeleted = async (stepId: number) => {
		try {
			// Удаляем шаг из базы данных
			await deleteStep(stepId);
			// Обновляем состояние, удаляя шаг из UI
			setSteps(prevSteps => prevSteps.filter(step => step.id !== stepId));
		} catch (error) {
			console.error('Ошибка при удалении шага:', error);
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

			{steps.length === 0 ? (
				<p>No steps available.</p>
			) : (
				<ul className='space-y-4'>
					{steps.map(step => (
						<li key={step.id} className='border p-4 rounded-lg shadow-sm'>
							<GuideStep step={step} onStepDeleted={handleStepDeleted} />
						</li>
					))}
				</ul>
			)}

			{/* Модалка для добавления нового шага */}
			<StepModal
				setId={setId}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onStepCreated={handleStepCreated}
			/>
		</div>
	);
};
