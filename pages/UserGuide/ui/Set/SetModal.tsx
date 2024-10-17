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
import { CreateSetInput, createSetSchema } from '@/lib/zod/setSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Set } from '@prisma/client';
import React, { useEffect, useRef } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { createSet, updateSet } from '../../data/set';
import { Modal } from '../../shared/Modal';

interface SetModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSetCreated: (newSet: Set) => void;
	onSetUpdated: (updatedSet: Set) => void;
	initialData?: Set | null;
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
		},
	});

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = methods;

	const inputRef = useRef<HTMLInputElement | null>(null); // Добавляем useRef для первого поля

	useEffect(() => {
		reset({ title: titleValue });
	}, [titleValue, reset]);

	useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus(); // Устанавливаем фокус на первое поле при открытии модалки
		}
	}, [isOpen]);

	const onSubmit = async (data: CreateSetInput) => {
		try {
			if (isEditing && initialData) {
				const updatedSet = await updateSet(initialData.id, data);
				onSetUpdated(updatedSet);
			} else {
				const newSet = await createSet(data);
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
										ref={inputRef} // Присваиваем ref для автофокуса
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
						<Button type='submit'>{isEditing ? 'Update' : 'Create'}</Button>
					</div>
				</form>
			</FormProvider>
		</Modal>
	);
}
