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
import { createStep, updateStep } from '@/pages/UserGuide/data/step';
import { Modal } from '@/pages/UserGuide/shared/Modal';
import { zodResolver } from '@hookform/resolvers/zod';
import { Step } from '@prisma/client';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

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
	const isEditing = Boolean(initialData);
	const localStorageKey = isEditing
		? `editStep_${setId}_${stepId}`
		: `newStep_${setId}`;

	// Хук для работы с localStorage
	const [stepData, setStepData, removeStepData] =
		useLocalStorage<CreateStepInput>(
			localStorageKey,
			isEditing && initialData
				? {
						title: initialData.title,
						description: initialData.description ?? '', // Преобразуем null в пустую строку
						order: initialData.order,
						elementId: initialData.elementId,
						imageUrl: initialData.imageUrl ?? undefined, // Преобразуем null в undefined для опционального поля
						imageChecked: initialData.imageChecked,
						imageHeight: initialData.imageHeight ?? 200, // Преобразуем null в дефолтное значение
						imageWidth: initialData.imageWidth ?? 200, // Преобразуем null в дефолтное значение
						pageUrl: initialData.pageUrl,
						setId: initialData.setId,
				  }
				: {
						// Для нового шага берем значения из localStorage или дефолтные значения
						title: '',
						description: '',
						order: maxOrder + 1,
						elementId: '',
						imageUrl: undefined,
						imageChecked: false,
						imageHeight: 200,
						imageWidth: 200,
						pageUrl: '',
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
		formState: { errors },
	} = methods;

	const inputRef = useRef<HTMLInputElement | null>(null); // Добавляем useRef для первого поля

	const [loading, setLoading] = useState<boolean>(false);

	// Следим за состоянием чекбокса imageChecked
	const isImageChecked = useWatch({
		control,
		name: 'imageChecked',
		defaultValue: stepData.imageChecked,
	});

	// Автофокус на первое поле при открытии модального окна
	useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus(); // Устанавливаем фокус на первое поле
		}
	}, [isOpen]);

	// Подгружаем данные из localStorage при открытии модального окна
	useEffect(() => {
		reset(stepData); // Сбрасываем форму с данными из localStorage
	}, [stepData, reset]);

	// Сохраняем данные формы в localStorage при каждом изменении
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
			if (isEditing && initialData) {
				const updatedStep = await updateStep(initialData.id, data);
				onStepUpdated(updatedStep);
			} else {
				const newStep = await createStep({ ...data, setId });
				onStepCreated(newStep);
			}
			reset();
			removeStepData();
			onClose();
		} catch (error) {
			console.error('Ошибка при создании/обновлении шага:', error);
		} finally {
			setLoading(false);
		}
	};

	// Обработчик для кнопки Cancel — сброс данных
	const handleCancel = () => {
		reset();
		removeStepData();
		onClose();
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
			</FormProvider>
		</Modal>
	);
};
