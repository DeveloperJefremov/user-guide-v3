'use client';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

interface ButtonElement {
	id: string;
	type: 'button';
	label: string;
	onClick: () => void;
}

interface LinkElement {
	id: string;
	type: 'link';
	label: string;
	href: string;
	target: '_blank' | '_self';
}

interface IconElement {
	id: string;
	type: 'icon';
	icon: string;
	label: string;
	onClick: () => void;
}

type Element = ButtonElement | LinkElement | IconElement;

const FirstSideBar: FC = () => {
	const router = useRouter();

	const elements: Element[] = [
		{
			id: 'btn-features',
			type: 'button',
			label: 'Features',
			onClick: () => router.push('/features'),
		},
		{
			id: 'btn-prices',
			type: 'button',
			label: 'Prices',
			onClick: () => router.push('/prices'),
		},
	];

	return (
		<aside className='flex flex-col items-center bg-dark-primary border-r border-black h-full p-4'>
			<h2 className='text-xl font-bold mb-6'>1</h2>
			<div className='flex flex-col items-center justify-around w-1/2 gap-12'>
				{elements.map(element => (
					<div key={element.id}>
						{element.type === 'button' && (
							<button
								id={element.id}
								onClick={element.onClick}
								className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
							>
								{element.label}
							</button>
						)}
					</div>
				))}
			</div>
		</aside>
	);
};

export default FirstSideBar;
