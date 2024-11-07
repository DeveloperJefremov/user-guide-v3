'use client';
import { Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const Features = () => {
	const router = useRouter();

	return (
		<div className='flex flex-col min-h-screen'>
			<header className='flex justify-between items-center p-4 border-b border-gray-200 relative'>
				<h1 className='text-lg font-semibold' id='page-title'>
					Главная страница
				</h1>

				{/* Иконка по центру */}
				<div
					className='absolute left-1/2 transform -translate-x-1/2'
					id='center-icon'
				>
					<Sun size={24} />
				</div>

				<div className='space-x-4'>
					<button
						id='home-button'
						onClick={() => router.push('/')}
						className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
					>
						Главная
					</button>
					<button
						id='prices-button'
						onClick={() => router.push('/prices')}
						className='px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600'
					>
						Цены
					</button>
				</div>
			</header>

			{/* Центрируем элементы-заглушки */}
			<main className='flex-grow flex flex-col items-center justify-center p-4'>
				<section id='feature-1' className='mb-4 text-center'>
					<h2 className='text-md font-semibold'>Feature 1</h2>
					<p>Описание первого элемента-заглушки...</p>
				</section>
				<section id='feature-2' className='mb-4 text-center'>
					<h2 className='text-md font-semibold'>Feature 2</h2>
					<p>Описание второго элемента-заглушки...</p>
				</section>
				<section id='feature-3' className='mb-4 text-center'>
					<h2 className='text-md font-semibold'>Feature 3</h2>
					<p>Описание третьего элемента-заглушки...</p>
				</section>
			</main>
		</div>
	);
};

export default Features;
