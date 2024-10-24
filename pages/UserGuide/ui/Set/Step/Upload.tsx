import { CreateStepInput } from '@/lib/zod/stepSchema';

import React, { useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UseFormSetValue } from 'react-hook-form';

interface UploadProps {
	onFileSelect: (file: File | null) => void;
	// initialPreview?: string | null;
	setValue: UseFormSetValue<CreateStepInput>; // Обновляем тип setValue
	// imageHeight: number;
	// imageWidth: number;
	// selectedFile?: File | null;
	getImageDimensions: (
		file: File
	) => Promise<{ width: number; height: number }>;
	previewUrl?: string | null;
	setPreviewUrl: (url: string | null) => void;
}

export const Upload = ({
	setValue,
	onFileSelect,
	// initialPreview,
	getImageDimensions,
	previewUrl,
	setPreviewUrl,
}: // selectedFile,
// imageHeight,
// imageWidth,
UploadProps) => {
	// const [previewUrl, setPreviewUrl] = useState<string | null>(
	// 	initialPreview || null
	// );
	const inputRef = useRef<HTMLInputElement | null>(null);
	// const [inputValue, setInputValue] = useState<string>('');

	// if (inputRef.current !== null && inputValue !== '') {
	// 	inputRef.current.value = inputValue;
	// }

	const onDrop = async (acceptedFiles: File[]) => {
		const file = acceptedFiles[0];
		if (file) {
			const fileUrl = URL.createObjectURL(file);
			setPreviewUrl(fileUrl);
			onFileSelect(file);

			const { width, height } = await getImageDimensions(file);
			setValue('imageWidth', width);
			setValue('imageHeight', height);
		}
	};

	const { getRootProps, getInputProps } = useDropzone({
		accept: {
			'image/*': [], // Разрешаем все типы изображений
		},
		onDrop,
		noClick: true, // Отключаем возможность клика
	});

	// console.log(inputRef);
	// const getImageDimensions = (
	// 	file: File
	// ): Promise<{ width: number; height: number }> => {
	// 	return new Promise((resolve, reject) => {
	// 		const img = new Image();
	// 		img.src = URL.createObjectURL(file);
	// 		img.onload = () => {
	// 			resolve({ width: img.width, height: img.height });
	// 		};
	// 		img.onerror = () => {
	// 			reject(new Error('Failed to load image'));
	// 		};
	// 	});
	// };

	// const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
	// 	const file = e.target.files?.[0];
	// 	if (file) {
	// 		const fileUrl = URL.createObjectURL(file);
	// 		setPreviewUrl(fileUrl);
	// 		onFileSelect(file);

	// 		// Получаем реальные размеры изображения и обновляем поля формы
	// 		const { width, height } = await getImageDimensions(file);

	// 		setValue('imageWidth', width);
	// 		setValue('imageHeight', height);
	// 	}
	// };

	// const handleRemoveImage = () => {
	// 	setPreviewUrl(null);

	// 	onFileSelect(null);
	// 	if (inputRef.current) {
	// 		inputRef.current.value = '';
	// 	}
	// 	setValue('imageHeight', 0);
	// 	setValue('imageWidth', 0);
	// };

	return (
		<div className='upload-container'>
			{/* Поле для выбора файла через кнопку отображается только если нет изображения */}
			{/* {!previewUrl && (
				<div className='relative mb-4 w-full'>
					<input
						type='file'
						accept='image/*'
						onChange={handleImageSelect}
						className='mt-2 p-2 border border-gray-300 rounded-md w-full'
						ref={inputRef}
						style={{ paddingRight: '3rem' }}
					/>
				</div>
			)} */}

			{/* Область Drag 'n' Drop или превью изображения */}
			<div
				{...getRootProps()}
				className='relative dropzone'
				style={{
					border: '2px dashed gray',
					padding: '10px',
					width: '100%',
					textAlign: 'center',
					position: 'relative',
					aspectRatio: '16 / 9',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					overflow: 'hidden',
				}}
			>
				{!previewUrl && (
					<>
						<input {...getInputProps()} />
						<p>Drag 'n' drop an image here</p>
					</>
				)}
				{previewUrl && (
					<div className='image-preview-container'>
						<img
							src={previewUrl}
							alt='Preview'
							style={{
								objectFit: 'contain',
								maxWidth: '100%',
								maxHeight: '100%',
							}}
						/>
					</div>
				)}
			</div>
		</div>
	);
};
