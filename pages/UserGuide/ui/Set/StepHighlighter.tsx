import { Step } from '@prisma/client';
import { useEffect } from 'react';
import tippy, { hideAll } from 'tippy.js';
import 'tippy.js/dist/tippy.css';

interface StepHighlighterProps {
	steps: Step[];
	currentStepIndex: number; // Текущий индекс шага приходит как проп
	goToNextStep: () => void; // Функция для перехода к следующему шагу
	goToPrevStep: () => void; // Функция для возврата к предыдущему шагу
}

export const StepHighlighter = ({
	steps,
	currentStepIndex,
	goToNextStep,
	goToPrevStep,
}: StepHighlighterProps) => {
	useEffect(() => {
		if (steps.length === 0) return;

		const step = steps[currentStepIndex];
		const element = document.getElementById(step.elementId);

		if (element) {
			tippy(element, {
				content: `
					<div>
						<h3 class="text-lg font-bold">${step.title}</h3>
						<p class="text-sm">${step.description || 'No description'}</p>
						<p class="text-sm">Element ID: ${step.elementId}</p>
						<p class="text-sm">Page URL: ${step.pageUrl}</p>
						<div class="mt-4 flex justify-between">
							<button id="back-btn" class="bg-blue-500 text-white px-2 py-1 rounded">Back</button>
							<button id="next-btn" class="bg-blue-500 text-white px-2 py-1 rounded">Next</button>
						</div>
					</div>
				`,
				allowHTML: true,
				trigger: 'manual',
				placement: 'right',
				interactive: true,
				onShown(instance) {
					const backBtn = document.getElementById('back-btn');
					const nextBtn = document.getElementById('next-btn');

					// Обработчики для кнопок
					if (backBtn) {
						backBtn.onclick = goToPrevStep; // Переход на предыдущий шаг
					}
					if (nextBtn) {
						nextBtn.onclick = goToNextStep; // Переход на следующий шаг
					}
				},
			}).show();

			// Подсветка текущего элемента
			element.classList.add('ring-2', 'ring-red-500', 'bg-red-100');
		}

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

	return null;
};
