import { Step } from '@prisma/client';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import tippy, { hideAll } from 'tippy.js';
import 'tippy.js/dist/tippy.css';

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
		if (steps.length === 0) return;

		const step = steps[currentStepIndex];
		const element = document.getElementById(step.elementId);

		if (element) {
			const tooltipDiv = document.createElement('div'); // Создаем элемент для тултипа
			setTooltipElement(tooltipDiv);

			const instance = tippy(element, {
				content: tooltipDiv, // Вместо строки используем элемент
				trigger: 'manual',
				placement: 'right',
				interactive: true,
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
		hideAll(); // Закрываем тултип
		const element = document.getElementById(steps[currentStepIndex].elementId);
		if (element) {
			element.classList.remove('ring-2', 'ring-red-500', 'bg-red-100'); // Убираем подсветку
		}
	};

	return (
		tooltipElement &&
		ReactDOM.createPortal(
			<div style={{ position: 'relative' }}>
				<button
					id='close-btn'
					className='absolute top-2 right-2'
					onClick={closeTooltip} // Закрываем тултип и убираем подсветку
				>
					<X className='w-5 h-5 text-gray-500 hover:text-gray-700' />
				</button>
				<h3 className='text-lg font-bold'>{steps[currentStepIndex].title}</h3>
				<p className='text-sm'>
					{steps[currentStepIndex].description || 'No description'}
				</p>
				<p className='text-sm'>
					Element ID: {steps[currentStepIndex].elementId}
				</p>
				<p className='text-sm'>Page URL: {steps[currentStepIndex].pageUrl}</p>
				<div className='mt-4 flex justify-between'>
					<button
						id='back-btn'
						className='bg-blue-500 text-white px-2 py-1 rounded'
						onClick={goToPrevStep}
					>
						Back
					</button>
					<button
						id='next-btn'
						className='bg-blue-500 text-white px-2 py-1 rounded'
						onClick={goToNextStep}
					>
						Next
					</button>
				</div>
			</div>,
			tooltipElement
		)
	);
};
