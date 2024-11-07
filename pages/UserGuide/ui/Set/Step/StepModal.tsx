'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLocalStorage } from '@/lib/hooks/useLocaleStorage';
import { storage } from '@/lib/store/firebase';
import { CreateStepInput, createStepSchema } from '@/lib/zod/stepSchema';
import { createStep, updateStep } from '@/pages/UserGuide/data/step';
import { Modal } from '@/pages/UserGuide/shared/Modal';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { Step } from '@prisma/client';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { LockIcon, TrashIcon, UnlockIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { Upload } from './Upload';
interface StepModalProps {
	setId: number;
	stepId?: number;
	isOpen: boolean;
	onClose: () => void;
	onStepCreated: (newStep: Step) => void;
	onStepUpdated: (updatedStep: Step) => void;
	initialData?: Step | null;
	maxOrder?: number;
}

export const StepModal = ({
	setId,
	stepId,
	isOpen,
	onClose,
	onStepCreated,
	onStepUpdated,
	initialData,
	maxOrder = 1,
}: StepModalProps) => {
	const inputRef = useRef<HTMLInputElement | null>(null);

	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [isLocked, setIsLocked] = useState<boolean>(true);

	const isEditing = Boolean(initialData);

	const getPreviewUrlKey = (setId: number, stepId?: number) =>
		isEditing && stepId
			? `previewUrl_${setId}_${stepId}`
			: `previewUrl_${setId}_new`;

	const localStorageKey = isEditing
		? `editStep_${setId}_${stepId}`
		: `newStep_${setId}`;

	const [stepData, setStepData, removeStepData] =
		useLocalStorage<CreateStepInput>(
			localStorageKey,
			isEditing && initialData
				? {
						title: initialData.title,
						description: initialData.description ?? '',
						order: initialData.order,
						elementId: initialData.elementId,
						imageUrl: initialData.imageUrl ?? undefined,
						imageChecked: initialData.imageChecked,
						imageHeight: initialData.imageHeight ?? 0,
						imageWidth: initialData.imageWidth ?? 0,
						// pageUrl: initialData.pageUrl,
						setId: initialData.setId,
				  }
				: {
						title: '',
						description: '',
						order: maxOrder + 1,
						elementId: '',
						imageUrl: undefined,
						imageChecked: false,
						imageHeight: 0,
						imageWidth: 0,
						// pageUrl: '',
						setId: setId,
				  }
		);

	const methods = useForm<CreateStepInput>({
		resolver: zodResolver(createStepSchema),
		defaultValues: stepData,
	});

	const {
		handleSubmit,
		reset,
		control,
		setValue,

		formState: { errors },
	} = methods;

	// Следим за состоянием чекбокса imageChecked
	const isImageChecked = useWatch({
		control,
		name: 'imageChecked',
		defaultValue: stepData.imageChecked,
	});

	useEffect(() => {
		console.log(stepData);
	}, [stepData]);

	// Автофокус на первое поле при открытии модального окна
	useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isOpen]);

	useEffect(() => {
		reset(stepData);
	}, [stepData, reset]);

	useEffect(() => {
		if (isOpen) {
			const previewKey = getPreviewUrlKey(setId, stepId);
			const savedPreview = localStorage.getItem(previewKey);
			if (savedPreview) {
				setPreviewUrl(savedPreview);
				setValue('imageUrl', savedPreview);
			}
		}
	}, [isOpen, setId, stepId, isEditing, setValue]);

	useEffect(() => {
		if (isOpen) {
			const subscription = methods.watch(data => {
				const validatedData = {
					...data,
					setId: data.setId ?? setId,
					title: data.title || '',
					description: data.description || '',
					order: data.order ?? 1,
					elementId: data.elementId || '',
					imageChecked: data.imageChecked ?? false,
					// pageUrl: data.pageUrl || '',
					imageHeight: data.imageHeight ?? 0,
					imageWidth: data.imageWidth ?? 0,
				};
				setStepData(validatedData);
			});
			return () => subscription.unsubscribe();
		}
	}, [methods, setStepData, isOpen, setId]);

	const generateUniqueFileName = (originalName: string, stepId?: number) => {
		return stepId ? `${stepId}_${originalName}` : `${uuidv4()}_${originalName}`;
	};
	const handleImageUpload = async (): Promise<string | null> => {
		if (!selectedFile) return null;

		return new Promise((resolve, reject) => {
			const uniqueFileName = generateUniqueFileName(selectedFile.name, stepId);
			const storageRef = ref(storage, `images/${uniqueFileName}`);
			const uploadTask = uploadBytesResumable(storageRef, selectedFile);

			uploadTask.on(
				'state_changed',
				snapshot => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					console.log(`Загрузка: ${progress}%`);
				},
				error => {
					console.error('Ошибка при загрузке:', error);
					reject(null);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
						console.log('Файл успешно загружен. URL:', downloadURL);
						resolve(downloadURL);
					});
				}
			);
		});
	};

	const convertFileToBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = error => reject(error);
		});
	};

	const handleFileSelect = async (file: File | null) => {
		const previewKey = getPreviewUrlKey(setId, stepId);
		setSelectedFile(file);
		if (file) {
			const fileBase64 = await convertFileToBase64(file);
			setValue('imageUrl', fileBase64);

			setPreviewUrl(fileBase64);
			localStorage.setItem(previewKey, fileBase64); // Сохраняем для уникального шага
		} else {
			setValue('imageUrl', '');
			setPreviewUrl(null);
			localStorage.removeItem(previewKey); // Удаляем изображение из localStorage для уникального шага
		}
	};

	const onSubmit = async (data: CreateStepInput) => {
		setLoading(true);

		try {
			// Проверка на существование элемента с указанным Element ID
			const element = document.getElementById(data.elementId);
			if (!element) {
				alert(
					'Element with this ID does not exist. Please enter a valid Element ID.'
				);
				setLoading(false);
				return;
			}

			let imageUrl = stepData.imageUrl;

			if (selectedFile) {
				imageUrl = (await handleImageUpload()) ?? undefined; // Загружаем изображение с уникальным именем
			}

			const stepDataToSave = {
				...data,
				imageUrl: imageUrl || data.imageUrl,
			};

			if (isEditing && initialData) {
				const updatedStep = await updateStep(initialData.id, stepDataToSave);
				onStepUpdated(updatedStep);
			} else {
				const newStep = await createStep({ ...stepDataToSave, setId });
				onStepCreated(newStep);
			}

			reset();
			removeStepData();
			localStorage.removeItem(`previewUrl_${setId}_new`);
			onClose();
		} catch (error) {
			console.error('Ошибка при создании/обновлении шага:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		reset();
		removeStepData();
		localStorage.removeItem(`previewUrl_${setId}_new`);
		onClose();
	};

	// Функции для изменения ширины и высоты
	const handleWidthChange = (value: number) => {
		if (isLocked) {
			const newHeight = Math.round((value * 9) / 16);
			setValue('imageWidth', value);
			setValue('imageHeight', newHeight);
		} else {
			setValue('imageWidth', value);
		}
	};

	const handleHeightChange = (value: number) => {
		if (isLocked) {
			const newWidth = Math.round((value * 16) / 9);
			setValue('imageHeight', value);
			setValue('imageWidth', newWidth);
		} else {
			setValue('imageHeight', value);
		}
	};

	const handleRemoveImage = () => {
		setPreviewUrl(null);
		setValue('imageUrl', ''); // Сбрасываем URL картинки
		setValue('imageHeight', undefined); // Сбрасываем высоту
		setValue('imageWidth', undefined); // Сбрасываем ширину
		// setValue('imageChecked', false);
		setSelectedFile(null);

		const previewKey = getPreviewUrlKey(setId, stepId);
		localStorage.removeItem(previewKey);

		if (inputRef.current) {
			inputRef.current.value = ''; // Очищаем input
		}
	};

	const toggleLock = () => {
		setIsLocked(!isLocked);
	};
	const getImageDimensions = (
		file: File
	): Promise<{ width: number; height: number }> => {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.src = URL.createObjectURL(file);
			img.onload = () => {
				resolve({ width: img.width, height: img.height });
			};
			img.onerror = () => {
				reject(new Error('Failed to load image'));
			};
		});
	};

	const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const fileUrl = URL.createObjectURL(file);
			setPreviewUrl(fileUrl);
			handleFileSelect(file);

			// Получаем реальные размеры изображения и обновляем поля формы
			const { width, height } = await getImageDimensions(file);

			setValue('imageWidth', width);
			setValue('imageHeight', height);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className='text-2xl font-bold mb-6'>
				{isEditing ? 'Edit' : 'Create'} Step
			</h2>
			<FormProvider {...methods}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className='mb-4'>
						<FormField
							name='title'
							control={control}
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-base font-medium text-gray-700'>
										Title
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder='Enter step title'
											className='mt-2 w-full border border-gray-300 rounded-md p-3 text-lg'
											ref={inputRef} // Присваиваем ref для автофокуса
										/>
									</FormControl>
									{errors.title && (
										<FormMessage>{errors.title.message}</FormMessage>
									)}
								</FormItem>
							)}
						/>
					</div>

					<div className='mb-4'>
						<FormField
							name='description'
							control={control}
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-base font-medium text-gray-700'>
										Description
									</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											placeholder='Enter step description'
											className='mt-2 w-full border border-gray-300 rounded-md p-3 text-lg'
										/>
									</FormControl>
									{errors.description && (
										<FormMessage>{errors.description.message}</FormMessage>
									)}
								</FormItem>
							)}
						/>
					</div>

					<div className='mb-4'>
						<FormField
							name='order'
							control={control}
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-base font-medium text-gray-700'>
										Order
									</FormLabel>
									<FormControl>
										<Input
											type='number'
											{...field}
											placeholder='Enter step order'
											className='mt-2 w-full border border-gray-300 rounded-md p-3 text-lg'
										/>
									</FormControl>
									{errors.order && (
										<FormMessage>{errors.order.message}</FormMessage>
									)}
								</FormItem>
							)}
						/>
					</div>

					<div className='mb-4'>
						<FormField
							name='elementId'
							control={control}
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-base font-medium text-gray-700'>
										Element ID
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder='Enter element ID'
											className='mt-2 w-full border border-gray-300 rounded-md p-3 text-lg'
										/>
									</FormControl>
									{errors.elementId && (
										<FormMessage>{errors.elementId.message}</FormMessage>
									)}
								</FormItem>
							)}
						/>
					</div>

					<div className='mb-4'>
						<FormField
							name='imageChecked'
							control={control}
							render={({ field }) => (
								<FormItem>
									<div className='flex items-center space-x-2'>
										<FormLabel className='text-base font-medium text-gray-700'>
											Image
										</FormLabel>
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
												ref={field.ref}
											/>
										</FormControl>
									</div>
								</FormItem>
							)}
						/>
					</div>

					{isImageChecked && (
						<>
							<div className='mb-4'>
								<Upload
									setValue={setValue}
									onFileSelect={handleFileSelect}
									previewUrl={previewUrl || stepData.imageUrl}
									setPreviewUrl={setPreviewUrl}
									getImageDimensions={getImageDimensions}
								/>
							</div>

							<div className='mb-4 flex items-center justify-between'>
								{/* Отображаем кнопку удаления только если изображение загружено */}
								{previewUrl || stepData.imageUrl ? (
									<div className='w-1/ mr-4'>
										<Button
											// type='button'
											variant='destructive'
											onClick={handleRemoveImage}
											className='flex items-center mt-2 h-10'
										>
											<TrashIcon className='w-5 h-5 mr-2' />
											Delete Image
										</Button>
									</div>
								) : (
									<div className='relative w-1/2 mr-4 mt-2 h-10'>
										<input
											type='file'
											accept='image/*'
											onChange={handleImageSelect}
											className='p-2 border border-gray-300 rounded-md w-full'
											ref={inputRef}
											style={{ paddingRight: '3rem' }}
										/>
									</div>
								)}

								{/* Правый блок — поля для ширины и высоты, и кнопка блокировки */}
								<div className='flex items-center space-x-2'>
									<div className='flex items-center'>
										<FormField
											name='imageHeight'
											control={control}
											render={({ field }) => (
												<FormItem className='flex items-center'>
													<FormLabel className='text-base font-medium text-gray-700 mr-2'>
														H
													</FormLabel>
													<FormControl>
														<Input
															type='number'
															{...field}
															placeholder='Height'
															className='w-20 border border-gray-300 rounded-md p-2'
															value={field.value || 0}
															onChange={e =>
																handleHeightChange(Number(e.target.value))
															}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
									</div>
									<div className='flex items-center'>
										<FormField
											name='imageWidth'
											control={control}
											render={({ field }) => (
												<FormItem className='flex items-center'>
													<FormLabel className='text-base font-medium text-gray-700 mr-2'>
														W
													</FormLabel>
													<FormControl>
														<Input
															type='number'
															{...field}
															placeholder='Width'
															className='w-20 border border-gray-300 rounded-md p-2'
															value={field.value || 0}
															onChange={e =>
																handleWidthChange(Number(e.target.value))
															}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
									</div>
									<Button
										type='button'
										variant='outline'
										onClick={toggleLock}
										className='mt-2'
									>
										{isLocked ? (
											<LockIcon className='w-5 h-5 ' />
										) : (
											<UnlockIcon className='w-5 h-5' />
										)}
									</Button>
								</div>
							</div>
						</>
					)}

					<div className='flex justify-end '>
						<Button
							type='button'
							variant='outline'
							onClick={handleCancel}
							className='mr-4'
							disabled={loading}
						>
							Cancel
						</Button>
						<Button type='submit' className='ml-4' disabled={loading}>
							{loading
								? isEditing
									? 'Updating...'
									: 'Adding...'
								: isEditing
								? 'Update Step'
								: 'Add Step'}
						</Button>
					</div>
				</form>
				<DevTool control={control} />
			</FormProvider>
		</Modal>
	);
};
