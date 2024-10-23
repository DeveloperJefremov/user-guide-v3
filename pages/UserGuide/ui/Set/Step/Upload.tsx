import { Button } from '@/components/ui/button';
import { TrashIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
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
	const inputRef = useRef<HTMLInputElement | null>(null); // Реф для сброса и программного обновления поля

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

			// Программно обновляем поле выбора файла
			if (inputRef.current) {
				const dataTransfer = new DataTransfer();
				dataTransfer.items.add(file);
				inputRef.current.files = dataTransfer.files;
			}
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

		// Сбрасываем значение поля выбора файла
		if (inputRef.current) {
			inputRef.current.value = ''; // Сбрасываем значение
		}
	};

	return (
		<div className='upload-container'>
			{/* Поле для выбора файла через кнопку */}
			<div className='relative mb-4 w-full'>
				<input
					type='file'
					accept='image/*'
					onChange={handleFileSelect}
					className='mt-2 p-2 border border-gray-300 rounded-md w-full'
					ref={inputRef} // Добавляем реф для управления полем
					style={{ paddingRight: '3rem' }} // Добавляем отступ для кнопки
				/>
				{previewUrl && (
					<Button
						variant='destructive'
						onClick={handleRemoveImage}
						className='absolute top-2 right-2 '
					>
						<TrashIcon className='w-5 h-5' /> {/* Иконка корзины */}
					</Button>
				)}
			</div>

			{/* Область Drag 'n' Drop или превью изображения */}
			<div
				{...getRootProps()}
				className='relative dropzone'
				style={{
					border: '2px dashed gray',
					padding: '20px',
					width: '100%',
					textAlign: 'center',
					height: `${imageHeight}px`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					overflow: 'hidden',
				}}
			>
				{/* Если изображение не загружено, отображаем Drag 'n' Drop */}
				{!previewUrl && (
					<>
						<input {...getInputProps()} />
						<p>Drag 'n' drop an image here</p>
					</>
				)}

				{/* Если изображение загружено, показываем превью */}
				{previewUrl && (
					<>
						<img
							src={previewUrl}
							alt='Preview'
							style={{
								width: '100%',
								height: '100%',
								objectFit: 'contain',
							}}
						/>
					</>
				)}
			</div>
		</div>
	);
};
