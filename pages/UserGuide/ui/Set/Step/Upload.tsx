import React, { useState } from 'react';

interface UploadProps {
	onFileSelect: (file: File | null) => void; // Передача выбранного файла
}

export const Upload: React.FC<UploadProps> = ({ onFileSelect }) => {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
			setPreviewUrl(null);
			onFileSelect(null); // Если файл не выбран, сбрасываем
		}
	};

	return (
		<div className='upload-container'>
			<input type='file' accept='image/*' onChange={handleFileChange} />
			{previewUrl && (
				<img
					src={previewUrl}
					alt='Preview'
					className='mt-4 w-32 h-32 object-cover'
				/>
			)}
		</div>
	);
};
