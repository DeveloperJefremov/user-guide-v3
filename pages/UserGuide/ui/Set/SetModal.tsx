'use client';

import { Button } from '@/components/ui/button';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useLocalStorage } from '@/lib/hooks/useLocaleStorage';
import { useUrlStore } from '@/lib/store/zustand/url-store';
import { SetWithSteps } from '@/pages/UserGuide/types/types';
import {
	CreateSetInput,
	createSetSchema,
} from '@/pages/UserGuide/zod/setSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Set as SetModel, Status } from '@prisma/client';
import React, { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { createSet, updateSet } from '../../data/set';
import { Modal } from '../../shared/Modal';
import { StatusSelector } from './StatusSelector';

interface SetModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSetCreated: (newSet: SetWithSteps) => void;
	onSetUpdated: (updatedSet: SetWithSteps) => void;
	initialData?: SetModel | null;
}

export function SetModal({
	isOpen,
	onClose,
	onSetCreated,
	onSetUpdated,
	initialData,
}: SetModalProps) {
	const isEditing = Boolean(initialData);
	const [isToggleOn, setIsToggleOn] = useState<boolean>(
		initialData?.isCompleted || false
	);
	const localStorageKey = isEditing ? `editSet_${initialData?.id}` : 'newSet';

	// Zustand store
	const { urls, fetchUrls } = useUrlStore();

	// Load URLs when the modal opens
	useEffect(() => {
		if (isOpen) {
			fetchUrls();
		}
	}, [isOpen, fetchUrls]);

	// Initialize form data with localStorage
	const [setData, setSetData, removeSetData] = useLocalStorage<CreateSetInput>(
		localStorageKey,
		isEditing && initialData
			? {
					title: initialData.title,
					pageUrlId: initialData.pageUrlId ?? 0,
					status: initialData.status || Status.DRAFT,
			  }
			: { title: '', status: Status.DRAFT, pageUrlId: 0 }
	);

	const methods = useForm<CreateSetInput>({
		resolver: zodResolver(createSetSchema),
		defaultValues: setData,
	});

	const {
		control,
		handleSubmit,
		reset,
		setValue,
		formState: { errors },
	} = methods;

	const inputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		reset(setData);
	}, [setData, reset]);

	useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isOpen]);

	useEffect(() => {
		if (isOpen) {
			const subscription = methods.watch(data => {
				const validatedData = {
					...data,
					title: data.title || '',
					status: data.status || Status.DRAFT,
					pageUrl: data.pageUrlId || '',
				};
				setIsToggleOn(initialData?.isCompleted || false);
				setSetData(validatedData); // Save all fields to localStorage
			});
			return () => subscription.unsubscribe();
		}
	}, [methods, setSetData, isOpen]);

	// const onSubmit = async (data: CreateSetInput) => {
	// 	try {
	// 		const dataWithDefaults: SetWithSteps = {
	// 			...data,
	// 			id: 0,
	// 			order: 0,
	// 			createdAt: new Date(),
	// 			updatedAt: new Date(),
	// 			userId: 0,
	// 			steps: [],
	// 			isCompleted: isToggleOn,
	// 			pageUrlId: data.pageUrlId ?? null,
	// 		};

	// 		if (isEditing && initialData) {
	// 			const updatedSet = await updateSet(initialData.id, dataWithDefaults);
	// 			// debugger;
	// 			onSetUpdated(updatedSet);
	// 		} else {
	// 			const newSet = await createSet(dataWithDefaults);
	// 			onSetCreated(newSet);
	// 		}
	// 		removeSetData();
	// 		onClose();
	// 	} catch (error) {
	// 		console.error('Error creating/updating set:', error);
	// 	}
	// };
	const onSubmit = async (data: CreateSetInput) => {
		try {
			// Обновляем данные с новыми значениями по умолчанию
			const dataWithDefaults: SetWithSteps = {
				...data,
				id: 0,
				order: 0,
				createdAt: new Date(),
				updatedAt: new Date(),
				userId: 0,
				steps: [],
				isCompleted: isToggleOn,
				pageUrlId: data.pageUrlId ?? null,
			};

			let updatedSet: SetWithSteps;

			if (isEditing && initialData) {
				const result = await updateSet(initialData.id, dataWithDefaults);
				const updatedPageUrl =
					urls.find(url => url.id === data.pageUrlId) || null;
				// Добавляем поле steps как пустой массив
				updatedSet = { ...result, steps: [], pageUrl: updatedPageUrl };
				onSetUpdated(updatedSet);
			} else {
				const result = await createSet(dataWithDefaults);
				const newPageUrl = urls.find(url => url.id === data.pageUrlId) || null;
				// Добавляем поле steps как пустой массив
				updatedSet = { ...result, steps: [], pageUrl: newPageUrl };
				onSetCreated(updatedSet);
			}

			removeSetData();
			onClose();
		} catch (error) {
			console.error('Error creating/updating set:', error);
		}
	};

	const handleCancel = () => {
		reset();
		removeSetData();
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className='text-2xl font-bold mb-6'>
				{isEditing ? 'Edit Tutorial' : 'Add New Tutorial'}
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
											placeholder='Enter title'
											className='mt-2 w-full border border-gray-300 rounded-md p-3 text-lg'
											ref={inputRef}
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
							name='pageUrlId'
							control={control}
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-base font-medium text-gray-700'>
										Page URL
									</FormLabel>
									<FormControl>
										<Select
											onValueChange={value => field.onChange(Number(value))} // Преобразуем значение в число
											value={field.value ? field.value.toString() : ''} // Убедитесь, что `value` всегда строка
										>
											<SelectTrigger>
												<SelectValue placeholder='Select a URL' />
											</SelectTrigger>
											<SelectContent>
												{urls.map(url => (
													<SelectItem key={url.id} value={url.id.toString()}>
														{url.url}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									{errors.pageUrlId && (
										<FormMessage>{errors.pageUrlId.message}</FormMessage>
									)}
								</FormItem>
							)}
						/>
					</div>

					<div className='mb-6'>
						<FormField
							name='status'
							control={control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Status</FormLabel>
									<StatusSelector
										currentStatus={field.value as Status}
										onChangeStatus={field.onChange}
										isEditing={isEditing}
										isToggleOn={isToggleOn}
										setIsToggleOn={setIsToggleOn}
									/>
									{errors.status && (
										<FormMessage className='text-red-500 text-sm mt-2'>
											{errors.status.message}
										</FormMessage>
									)}
								</FormItem>
							)}
						/>
					</div>

					<div className='flex justify-end'>
						<Button
							type='button'
							variant='outline'
							onClick={handleCancel}
							className='mr-4'
						>
							Cancel
						</Button>
						<Button variant='default' type='submit' className='btn'>
							{isEditing ? 'Update' : 'Create'}
						</Button>
					</div>
				</form>
			</FormProvider>
		</Modal>
	);
}
