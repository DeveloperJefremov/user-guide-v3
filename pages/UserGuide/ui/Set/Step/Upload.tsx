import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useEffect, useState } from 'react';

interface UploadProps {
	onFileSelect: (file: File | null) => void; // Передача выбранного файла
	initialPreview?: string | null; // Превью изображения, если уже выбрано
	imageHeight: number; // Высота изображения, переданная из StepModal
	imageWidth: number; // Ширина изображения, переданная из StepModal
}

export const Upload = ({
	onFileSelect,
	initialPreview,
	imageHeight,
	imageWidth,
}: UploadProps) => {
	const [previewUrl, setPreviewUrl] = useState<string | null>(
		initialPreview || localStorage.getItem('previewUrl') || null
	); // Используем переданное превью или загружаем из локального хранилища

	useEffect(() => {
		if (initialPreview) {
			setPreviewUrl(initialPreview); // Если передано превью, показываем его
			localStorage.setItem('previewUrl', initialPreview); // Сохраняем в локальное хранилище
		}
	}, [initialPreview]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]; // Получаем выбранный файл
		if (file) {
			const reader = new FileReader();

			reader.onloadend = () => {
				setPreviewUrl(reader.result as string); // Показываем превью изображения
				onFileSelect(file); // Передаём выбранный файл в родительский компонент
				localStorage.setItem('previewUrl', reader.result as string); // Сохраняем превью в локальное хранилище
			};

			reader.readAsDataURL(file);
		} else {
			handleRemoveImage(); // Если файл не выбран, сбрасываем
		}
	};

	const handleRemoveImage = () => {
		setPreviewUrl(null);
		onFileSelect(null); // Убираем файл из состояния родительского компонента
		localStorage.removeItem('previewUrl'); // Убираем изображение из локального хранилища
	};

	return (
		<div className='upload-container'>
			<Input
				type='file'
				accept='image/*'
				onChange={handleFileChange}
				className='mt-2 cursor-pointer'
			/>
			{previewUrl && (
				<div className='mt-4 flex items-center justify-between'>
					{/* Статичная рамка для отображения максимальных размеров */}
					<div
						style={{
							width: '200px', // Максимальная ширина рамки
							height: '200px', // Максимальная высота рамки
							border: '2px dashed gray', // Статичная рамка
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							overflow: 'hidden', // Обрезка изображения, если оно превышает рамку
						}}
					>
						<img
							src={previewUrl}
							alt='Preview'
							style={{
								width: `${imageWidth / 2}px`, // Отображаем в половину размера
								height: `${imageHeight / 2}px`, // Отображаем в половину размера
								maxWidth: '100%', // Убедимся, что изображение не выходит за рамки
								maxHeight: '100%', // Убедимся, что изображение не выходит за рамки
							}}
							className='object-contain' // Подгонка изображения в пределах рамки
						/>
					</div>
					<Button
						variant='destructive'
						onClick={handleRemoveImage}
						className='mt-2'
					>
						Remove Image
					</Button>
				</div>
			)}
		</div>
	);
};
