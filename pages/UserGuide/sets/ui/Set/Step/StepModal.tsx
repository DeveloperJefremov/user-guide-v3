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
import { CreateStepInput, createStepSchema } from '@/lib/zod/stepSchema';
import { createStep } from '@/pages/UserGuide/sets/data/step';
import { zodResolver } from '@hookform/resolvers/zod';
import { Step } from '@prisma/client';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

interface StepModalProps {
	setId: number;
	isOpen: boolean;
	onClose: () => void;
	onStepCreated: (newStep: Step) => void;
}

export const StepModal = ({
	setId,
	isOpen,
	onClose,
	onStepCreated,
}: StepModalProps) => {
	const localStorageKey = `newStep_${setId}`;

	// Хук для работы с localStorage
	const [stepData, setStepData, removeStepData] =
		useLocalStorage<CreateStepInput>(localStorageKey, {
			title: '',
			description: '',
			order: 1,
			elementId: '',
			imageUrl: undefined,
			imageChecked: false,
			imageHeight: 200,
			imageWidth: 200,
			pageUrl: '',
			setId: setId,
		});

	const methods = useForm<CreateStepInput>({
		resolver: zodResolver(createStepSchema),
		defaultValues: stepData,
	});

	const {
		handleSubmit,
		reset,
		control,
		formState: { errors },
	} = methods;

	const [loading, setLoading] = useState<boolean>(false);
	const [isMounted, setIsMounted] = useState<boolean>(false);
	const modalContentRef = useRef<HTMLDivElement>(null);

	// Следим за состоянием чекбокса imageChecked
	const isImageChecked = useWatch({
		control,
		name: 'imageChecked',
		defaultValue: stepData.imageChecked,
	});

	useEffect(() => {
		setIsMounted(true);
		return () => setIsMounted(false);
	}, []);

	// Подгружаем данные из localStorage при открытии модального окна
	useEffect(() => {
		if (isOpen) {
			reset(stepData); // Сбрасываем форму с данными из localStorage
		}
	}, [isOpen, stepData, reset]);

	// Сохраняем данные формы в localStorage при каждом изменении
	useEffect(() => {
		if (isOpen) {
			const subscription = methods.watch(data => {
				// Проверка значений перед обновлением
				const validatedData = {
					...data,
					setId: data.setId ?? setId, // Используем setId по умолчанию, если его нет
					title: data.title || '', // Пустая строка по умолчанию для текстовых полей
					description: data.description || '',
					order: data.order ?? 1, // Используем 1 как значение по умолчанию
					elementId: data.elementId || '',
					imageChecked: data.imageChecked ?? false,
					pageUrl: data.pageUrl || '',
					imageHeight: data.imageHeight ?? 200,
					imageWidth: data.imageWidth ?? 200,
				};
				setStepData(validatedData); // Обновляем данные в localStorage
			});
			return () => subscription.unsubscribe();
		}
	}, [methods, setStepData, isOpen, setId]);

	const onSubmit = async (data: CreateStepInput) => {
		setLoading(true);
		try {
			const newStep = await createStep({ ...data, setId });
			onStepCreated(newStep);
			removeStepData(); // Удаляем данные из localStorage после создания шага
			onClose(); // Закрываем модальное окно
			reset();
		} catch (error) {
			console.error('Ошибка при создании шага:', error);
		} finally {
			setLoading(false);
		}
	};

	// Закрытие модального окна и сброс данных
	// Закрытие модального окна без сброса данных
	const handleCloseWithoutReset = () => {
		onClose(); // Просто закрываем окно, не сбрасываем данные
	};

	// Обработчик для кнопки Cancel — сброс данных
	const handleCancel = () => {
		reset(); // Сбрасываем данные формы
		removeStepData(); // Очищаем localStorage
		onClose(); // Закрываем модальное окно
	};
	// Закрываем окно при клике на серый фон
	const handleOverlayClick = (event: React.MouseEvent) => {
		if (
			modalContentRef.current &&
			!modalContentRef.current.contains(event.target as Node)
		) {
			event.stopPropagation();
			handleCloseWithoutReset();
		}
	};

	if (!isOpen) return null;

	return isMounted
		? ReactDOM.createPortal(
				<div
					className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'
					onClick={handleOverlayClick}
					aria-modal='true'
					role='dialog'
					aria-labelledby='modal-title'
				>
					<div
						className='bg-white p-8 rounded-lg max-w-lg w-full shadow-md'
						ref={modalContentRef}
						onClick={e => e.stopPropagation()}
					>
						<h2 className='text-2xl font-bold mb-6'>Add New Step</h2>
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
													<FormMessage>
														{errors.description.message}
													</FormMessage>
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
										name='pageUrl'
										control={control}
										render={({ field }) => (
											<FormItem>
												<FormLabel className='text-base font-medium text-gray-700'>
													Page URL
												</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder='Enter page URL'
														className='mt-2 w-full border border-gray-300 rounded-md p-3 text-lg'
													/>
												</FormControl>
												{errors.pageUrl && (
													<FormMessage>{errors.pageUrl.message}</FormMessage>
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
											<FormField
												name='imageHeight'
												control={control}
												render={({ field }) => (
													<FormItem>
														<FormLabel className='text-base font-medium text-gray-700'>
															Image Height
														</FormLabel>
														<FormControl>
															<Input
																type='number'
																{...field}
																placeholder='Enter image height'
																className='mt-2 w-full border border-gray-300 rounded-md p-3 text-lg'
															/>
														</FormControl>
													</FormItem>
												)}
											/>
										</div>

										<div className='mb-4'>
											<FormField
												name='imageWidth'
												control={control}
												render={({ field }) => (
													<FormItem>
														<FormLabel className='text-base font-medium text-gray-700'>
															Image Width
														</FormLabel>
														<FormControl>
															<Input
																type='number'
																{...field}
																placeholder='Enter image width'
																className='mt-2 w-full border border-gray-300 rounded-md p-3 text-lg'
															/>
														</FormControl>
													</FormItem>
												)}
											/>
										</div>
									</>
								)}

								<div className='flex justify-end'>
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
										{loading ? 'Adding...' : 'Add Step'}
									</Button>
								</div>
							</form>
						</FormProvider>
					</div>
				</div>,
				document.getElementById('modal-root')!
		  )
		: null;
};
