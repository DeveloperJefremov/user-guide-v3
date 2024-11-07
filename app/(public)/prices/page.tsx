'use client'; // обозначаем компонент как Client Component

import { Home, Info, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
const Prices = () => {
	const router = useRouter();

	return (
		<main className='flex flex-col min-h-screen justify-between'>
			{/* Основной контент страницы */}
			<div className='flex-grow p-4'>
				<h1 className='text-lg font-semibold' id='guide-title'>
					Страница гайда
				</h1>
				<p>Контент гайда...</p>
			</div>

			{/* Футер с кнопками */}
			<footer className='flex justify-between items-center p-4 border-t border-gray-200'>
				<div className='space-x-4'>
					<button
						id='home-button'
						onClick={() => router.push('/')}
						className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
					>
						Главная
					</button>
					<button
						id='features-button'
						onClick={() => router.push('/features')}
						className='px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600'
					>
						Особенности
					</button>
				</div>
				<div className='flex space-x-4'>
					<div id='icon-info' className='cursor-pointer'>
						<Info size={24} />
					</div>
					<div id='icon-star' className='cursor-pointer'>
						<Star size={24} />
					</div>
					<div id='icon-home' className='cursor-pointer'>
						<Home size={24} />
					</div>
				</div>
			</footer>
		</main>
	);
};

export default Prices;
