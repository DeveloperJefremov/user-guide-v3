// components/Footer.tsx

import React from 'react';

export const SetFooter = () => {
	return (
		<footer className='bg-gray-800 text-white p-4 mt-4'>
			<p className='text-center'>
				© {new Date().getFullYear()} Ваше приложение
			</p>
		</footer>
	);
};
