'use client';

import { Button } from '@/components/ui/button';
import {
	FormControl,
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
import { Controller, FormProvider, useForm } from 'react-hook-form';
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
	const localStorageKey = isEditing
		? `editSetTitle_${initialData?.id}`
		: 'newSetTitle';

	const [titleValue, setTitleValue, removeTitleValue] = useLocalStorage<string>(
		localStorageKey,
		initialData?.title || ''
	);

	const methods = useForm<CreateSetInput>({
		resolver: zodResolver(createSetSchema),
		defaultValues: {
			title: titleValue,
			status: initialData?.status || Status.DRAFT, // Устанавливаем DRAFT как статус по умолчанию
		},
	});

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = methods;

	const inputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		reset({ title: titleValue });
	}, [titleValue, reset]);

	useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isOpen]);

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
			removeTitleValue();
			onClose();
		} catch (error) {
			console.error('Error creating/updating set:', error);
		}
	};

	const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTitleValue(event.target.value);
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className='text-2xl font-bold mb-6'>
				{isEditing ? 'Edit Tutorial' : 'Add New Tutorial'}
			</h2>
			<FormProvider {...methods}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Controller
						name='title'
						control={control}
						render={({ field }) => (
							<FormItem className='mb-6'>
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Input
										id='title'
										type='text'
										{...field}
										value={titleValue}
										onChange={handleTitleChange}
										className='mt-2'
										ref={inputRef}
									/>
								</FormControl>
								{errors.title && (
									<FormMessage className='text-red-500 text-sm mt-2'>
										{(errors.title as any).message}
									</FormMessage>
								)}
							</FormItem>
						)}
					/>

					{/* Интегрируем компонент StatusSelector */}
					<Controller
						name='status'
						control={control}
						render={({ field }) => (
							<FormItem className='mb-6'>
								<FormLabel>Status</FormLabel>
								<StatusSelector
									currentStatus={field.value as Status}
									onChangeStatus={field.onChange}
								/>
								{errors.status && (
									<FormMessage className='text-red-500 text-sm mt-2'>
										{(errors.status as any).message}
									</FormMessage>
								)}
							</FormItem>
						)}
					/>

					<div className='flex justify-end'>
						<Button
							type='button'
							variant='outline'
							onClick={() => {
								removeTitleValue();
								onClose();
							}}
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
