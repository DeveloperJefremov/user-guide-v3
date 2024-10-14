'use client';

import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/lib/hooks/useLocaleStorage';
import { CreateSetInput, createSetSchema } from '@/lib/zod/setSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Set } from '@prisma/client';
import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { createSet } from '../actions/set';

interface AddSetModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSetCreated: (newSet: Set) => void;
}

export function AddSetModal({
	isOpen,
	onClose,
	onSetCreated,
}: AddSetModalProps) {
	const [titleValue, setTitleValue, removeTitleValue] = useLocalStorage<string>(
		'newSetTitle',
		''
	);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateSetInput>({
		resolver: zodResolver(createSetSchema),
		defaultValues: {
			title: titleValue,
		},
	});

	const modalContentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		reset({ title: titleValue });
	}, [titleValue, reset]);

	const onSubmit = async (data: CreateSetInput) => {
		try {
			const newSet = await createSet(data);
			onSetCreated(newSet);
			removeTitleValue();
			onClose();
		} catch (error) {
			console.error('Error creating set:', error);
		}
	};

	const onClearStorageClose = () => {
		removeTitleValue();
		onClose();
	};

	const handleOverlayClick = (event: React.MouseEvent) => {
		if (
			modalContentRef.current &&
			!modalContentRef.current.contains(event.target as Node)
		) {
			onClose();
		}
	};

	if (!isOpen) return null;

	const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTitleValue(event.target.value);
	};

	return (
		<div
			className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'
			onClick={handleOverlayClick}
		>
			<div
				className='bg-white p-8 rounded-lg max-w-lg w-full'
				ref={modalContentRef}
				onClick={e => e.stopPropagation()}
			>
				<h2 className='text-2xl font-bold mb-6'>Add New Tutorial</h2>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className='mb-6'>
						<label
							htmlFor='title'
							className='block text-base font-medium text-gray-700'
						>
							Title
						</label>
						<input
							id='title'
							type='text'
							{...register('title')}
							value={titleValue}
							onChange={handleTitleChange}
							className='mt-2 block w-full border border-gray-300 rounded-md p-3 text-lg'
						/>
						{errors.title && (
							<p className='text-red-500 text-sm mt-2'>
								{(errors.title as any).message}
							</p>
						)}
					</div>
					<div className='flex justify-end'>
						<Button
							type='button'
							variant='secondary'
							onClick={onClearStorageClose}
							className='mr-4'
						>
							Cancel
						</Button>
						<Button type='submit'>Create</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
