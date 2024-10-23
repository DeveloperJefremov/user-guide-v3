import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface UploadProps {
	onFileSelect: (file: File | null) => void;
	initialPreview?: string | null;
	imageHeight: number;
	imageWidth: number;
}

export const Upload = ({
	onFileSelect,
	initialPreview,
	imageHeight,
	imageWidth,
}: UploadProps) => {
	const [previewUrl, setPreviewUrl] = useState<string | null>(
		initialPreview || localStorage.getItem('previewUrl') || null
	);

	useEffect(() => {
		if (initialPreview) {
			setPreviewUrl(initialPreview); // Если передано начальное превью, устанавливаем его
		}
	}, [initialPreview]);

	const onDrop = (acceptedFiles: File[]) => {
		const file = acceptedFiles[0];
		if (file) {
			setPreviewUrl(URL.createObjectURL(file));
			onFileSelect(file); // Передаем выбранный файл в родительский компонент
		}
	};

	const { getRootProps, getInputProps } = useDropzone({
		accept: {
			'image/*': [], // Разрешаем все типы изображений
		},
		onDrop,
		noClick: true, // Отключаем возможность клика
	});

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setPreviewUrl(URL.createObjectURL(file));
			onFileSelect(file); // Передаем выбранный файл в родительский компонент
		}
	};

	const handleRemoveImage = () => {
		setPreviewUrl(null);
		onFileSelect(null); // Убираем файл из состояния родительского компонента
		localStorage.removeItem('previewUrl'); // Убираем изображение из локального хранилища
	};

	return (
		<div className='upload-container'>
			{/* Кнопка для выбора файла */}
			<div className='mb-4'>
				<label className='block text-sm font-medium text-gray-700'>
					Choose an image
				</label>
				<input
					type='file'
					accept='image/*'
					onChange={handleFileSelect}
					className='mt-2 p-2 border border-gray-300 rounded-md'
				/>
			</div>

			{/* Зона для перетаскивания файлов (только через drag and drop) */}
			<div className='flex items-center justify-between'>
				<div
					{...getRootProps()}
					className='dropzone'
					style={{
						border: '2px dashed gray',
						padding: '20px',
						width: '48%',
						textAlign: 'center',
					}}
				>
					<input {...getInputProps()} />
					<p>Drag 'n' drop an image here</p>
				</div>

				{previewUrl && (
					<Button
						variant='destructive'
						onClick={handleRemoveImage}
						className='ml-4 w-48' // Ширина кнопки удаления
					>
						Remove Image
					</Button>
				)}
			</div>

			{/* Если изображение загружено, показываем превью ниже */}
			{previewUrl && (
				<div
					style={{
						width: '100%', // Изображение на всю ширину формы
						height: `${imageHeight}px`,
						border: '2px dashed gray',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						overflow: 'hidden',
						marginTop: '16px', // Отступ сверху для отделения от полей
					}}
				>
					<img
						src={previewUrl}
						alt='Preview'
						width={imageWidth} // Указываем ширину
						height={imageHeight} // Указываем высоту
						style={{
							width: '100%', // Ширина изображения на 100% от контейнера
							height: '100%', // Высота изображения
							objectFit: 'contain',
						}}
					/>
				</div>
			)}
		</div>
	);
};
