// components/Footer.tsx

import { Button } from '@/components/ui/button';
import React from 'react';

interface SetFooterProps {
	onLaunch: () => void; // Функция, вызываемая при нажатии на кнопку
}

export const SetFooter = ({ onLaunch }: SetFooterProps) => {
	return (
		<footer className='p-4 mt-4'>
			<Button onClick={onLaunch}>Launch Tutorial</Button>
		</footer>
	);
};
