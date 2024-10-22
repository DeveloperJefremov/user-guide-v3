import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useEffect, useState } from 'react';

interface UploadProps {
	onFileSelect: (file: File | null) => void; // Передача выбранного файла
	initialPreview?: string | null; // Превью изображения, если уже выбрано
}

export const Upload: React.FC<UploadProps> = ({
	onFileSelect,
	initialPreview,
}) => {
	const [previewUrl, setPreviewUrl] = useState<string | null>(
		initialPreview || null
	); // Используем переданное превью

	useEffect(() => {
		if (initialPreview) {
			setPreviewUrl(initialPreview); // Если передано превью, показываем его
		}
	}, [initialPreview]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]; // Получаем выбранный файл
		if (file) {
			const reader = new FileReader();

			reader.onloadend = () => {
				setPreviewUrl(reader.result as string); // Показываем превью изображения
				onFileSelect(file); // Передаём выбранный файл в родительский компонент
			};

			reader.readAsDataURL(file);
		} else {
			handleRemoveImage(); // Если файл не выбран, сбрасываем
		}
	};

	const handleRemoveImage = () => {
		setPreviewUrl(null);
		onFileSelect(null); // Убираем файл из состояния родительского компонента
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
					<img
						src={previewUrl}
						alt='Preview'
						className='w-32 h-32 object-cover border border-gray-200 rounded'
					/>
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
