import { Step } from '@prisma/client';
import { useEffect } from 'react';
import tippy, { hideAll } from 'tippy.js';
import 'tippy.js/dist/tippy.css';

interface StepHighlighterProps {
	steps: Step[];
}

export const StepHighlighter = ({ steps }: StepHighlighterProps) => {
	useEffect(() => {
		steps.forEach(step => {
			const element = document.getElementById(step.elementId);

			if (element) {
				tippy(element, {
					content: `
            <div>
              <h3 class="text-lg font-bold">${step.title}</h3>
              <p class="text-sm">${step.description || 'No description'}</p>
              <p class="text-sm">Element ID: ${step.elementId}</p>
              <p class="text-sm">Page URL: ${step.pageUrl}</p>
            </div>
          `,
					allowHTML: true,
					trigger: 'manual',
					placement: 'right',
					interactive: true,
				}).show();

				// Подсвечиваем элемент (используем Tailwind для стилей)
				element.classList.add('ring-2', 'ring-red-500', 'bg-red-100');
			}
		});

		return () => {
			// Скрываем все тултипы и убираем подсветку
			hideAll(); // Используем hideAll из tippy.js
			steps.forEach(step => {
				const element = document.getElementById(step.elementId);
				if (element) {
					element.classList.remove('ring-2', 'ring-red-500', 'bg-red-100');
				}
			});
		};
	}, [steps]);

	return null; // Этот компонент не отображает контент, он только управляет подсветкой
};
