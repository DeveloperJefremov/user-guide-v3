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
import { useLocalStorage } from '@/lib/hooks/useLocaleStorage';
import { SetWithSteps } from '@/lib/types/types';
import { CreateSetInput, createSetSchema } from '@/lib/zod/setSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Set as SetModel, Status } from '@prisma/client';
import React, { useEffect, useRef } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
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
	const localStorageKey = isEditing ? `editSet_${initialData?.id}` : 'newSet';

	// Инициализация всех данных формы в localStorage
	const [setData, setSetData, removeSetData] = useLocalStorage<CreateSetInput>(
		localStorageKey,
		isEditing && initialData
			? {
					title: initialData.title,
					status: initialData.status,
					pageUrl: initialData.pageUrl,
			  }
			: {
					title: '',
					status: Status.DRAFT,
					pageUrl: '',
			  }
	);

	// Используем setData для defaultValues в useForm
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

	// Отслеживаем изменения всех полей и обновляем setData
	useEffect(() => {
		if (isOpen) {
			const subscription = methods.watch(data => {
				const validatedData = {
					...data,
					title: data.title || '',
					status: data.status || Status.DRAFT,
					pageUrl: data.pageUrl || '',
				};
				setSetData(validatedData); // Сохраняем все поля в localStorage
			});
			return () => subscription.unsubscribe();
		}
	}, [methods, setSetData, isOpen]);

	const onSubmit = async (data: CreateSetInput) => {
		try {
			const dataWithDefaults: SetWithSteps = {
				...data,
				id: 0,
				order: 0,
				createdAt: new Date(),
				updatedAt: new Date(),
				userId: 0,
				steps: [],
			};

			if (isEditing && initialData) {
				const updatedSet = await updateSet(initialData.id, dataWithDefaults);
				onSetUpdated(updatedSet);
			} else {
				const newSet = await createSet(dataWithDefaults);
				onSetCreated(newSet);
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
