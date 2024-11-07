'use client';

import { CardContent } from '@/components/ui/card';
import Image from 'next/image';
import React from 'react';

interface StepCardProps {
	description?: string;
	elementId: string;
	imageUrl?: string;
	imageWidth?: number;
	imageHeight?: number;
}

export const StepCard = ({
	description,
	elementId,
	imageUrl,
	imageWidth = 200,
	imageHeight = 200,
}: StepCardProps) => {
	return (
		<CardContent className='flex flex-col items-center text-center'>
			{description && <p className='text-gray-700 mt-1'>{description}</p>}
			<p className='text-gray-500 mt-2'>Element ID: {elementId}</p>
			{imageUrl && (
				<div className='mt-4 flex justify-center'>
					<Image
						src={imageUrl}
						alt='Step image'
						width={imageWidth}
						height={imageHeight}
						className='mt-2 rounded-lg'
						style={{
							maxWidth: '100%', // Ограничиваем ширину для адаптивности
							maxHeight: '300px', // Максимальная высота изображения
							width: 'auto',
							height: 'auto',
						}}
					/>
				</div>
			)}
		</CardContent>
	);
};
