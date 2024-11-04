'use client';

import { Step } from '@prisma/client';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import tippy, { hideAll } from 'tippy.js';
import 'tippy.js/dist/tippy.css';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StepHighlighterProps {
	steps: Step[];
	currentStepIndex: number;
	goToNextStep: () => void;
	goToPrevStep: () => void;
	setIsLaunching: (isLaunching: boolean) => void;
}

export const StepHighlighter = ({
	steps,
	currentStepIndex,
	goToNextStep,
	goToPrevStep,
	setIsLaunching,
}: StepHighlighterProps) => {
	const [tooltipElement, setTooltipElement] = useState<HTMLElement | null>(
		null
	);

	useEffect(() => {
		if (steps.length === 0 || !steps[currentStepIndex]) return;

		const step = steps[currentStepIndex];
		const element = document.getElementById(step.elementId);

		if (element) {
			const tooltipDiv = document.createElement('div'); // Создаем элемент для тултипа
			setTooltipElement(tooltipDiv);

			const instance = tippy(element, {
				content: tooltipDiv,
				trigger: 'manual',
				placement: 'right',
				interactive: true,
				hideOnClick: false, // Теперь тултип закрывается только вручную
				arrow: false,
			});

			instance.show();

			// Добавляем классы для подсветки элемента
			element.classList.add('ring-2', 'ring-red-500', 'bg-red-100');
		}

		// Очистка при смене шага или размонтировании компонента
		return () => {
			hideAll();
			steps.forEach(step => {
				const element = document.getElementById(step.elementId);
				if (element) {
					element.classList.remove('ring-2', 'ring-red-500', 'bg-red-100');
				}
			});
		};
	}, [currentStepIndex, steps]);

	// Функция для закрытия тултипа и удаления подсветки
	const closeTooltip = () => {
		setIsLaunching(false);
		hideAll();
		const element = document.getElementById(steps[currentStepIndex].elementId);
		if (element) {
			element.classList.remove('ring-2', 'ring-red-500', 'bg-red-100'); // Убираем подсветку
		}
	};

	if (!steps[currentStepIndex]) return null;

	return (
		tooltipElement &&
		ReactDOM.createPortal(
			<Card className='relative p-4 max-w-xs'>
				<CardHeader>
					<CardTitle className='text-lg font-bold'>
						{steps[currentStepIndex].title}
					</CardTitle>
					<Button
						variant='ghost'
						size='icon'
						className='absolute top-2 right-2'
						onClick={closeTooltip} // Закрываем тултип и убираем подсветку
					>
						<X className='w-5 h-5 text-gray-500 hover:text-gray-700' />
					</Button>
				</CardHeader>
				<CardContent>
					<p className='text-sm'>
						{steps[currentStepIndex].description || 'No description'}
					</p>
					<p className='text-sm'>
						Element ID: {steps[currentStepIndex].elementId}
					</p>
					{/* <p className='text-sm'>Page URL: {steps[currentStepIndex].pageUrl}</p> */}

					{/* Отображение изображения, если оно есть */}
					{steps[currentStepIndex].imageUrl && (
						<img
							src={steps[currentStepIndex].imageUrl}
							alt='Step Image'
							className='mt-4 rounded-lg'
							style={{
								width: `${steps[currentStepIndex].imageWidth || 'auto'}px`, // Устанавливаем ширину
								height: `${steps[currentStepIndex].imageHeight || 'auto'}px`, // Устанавливаем высоту
								maxWidth: '100%', // Гарантируем, что изображение не выйдет за пределы контейнера
								maxHeight: '100%', // Ограничиваем высоту для мобильных устройств
							}}
						/>
					)}

					{/* Динамический счётчик шагов */}
					<p className='text-sm font-medium mt-4'>
						Total steps: {currentStepIndex + 1} of {steps.length}
					</p>

					<div className='mt-4 flex justify-between'>
						<Button variant='secondary' onClick={goToPrevStep}>
							Back
						</Button>
						<Button variant='default' onClick={goToNextStep}>
							Next
						</Button>
					</div>
				</CardContent>
			</Card>,
			tooltipElement
		)
	);
};
