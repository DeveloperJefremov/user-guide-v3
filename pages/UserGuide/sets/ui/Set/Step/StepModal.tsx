'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLocalStorage } from '@/lib/hooks/useLocaleStorage';
import { CreateStepInput, createStepSchema } from '@/lib/zod/stepSchema';
import { createStep } from '@/pages/UserGuide/sets/data/step';
import { zodResolver } from '@hookform/resolvers/zod';
import { Step } from '@prisma/client';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

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

	const [stepData, setStepData, removeStepData] =
		useLocalStorage<CreateStepInput>(localStorageKey, {
			title: '',
			description: '',
			order: 1,
			elementId: '',
			imageUrl: '',
			imageChecked: false,
			imageHeight: 1,
			imageWidth: 1,
			pageUrl: '',
			setId: setId, // Не забудьте передать правильное значение
		});

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateStepInput>({
		resolver: zodResolver(createStepSchema),
		defaultValues: stepData,
	});

	const [loading, setLoading] = useState(false);
	const modalContentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isOpen && modalContentRef.current) {
			const input = modalContentRef.current.querySelector('input');
			if (input) {
				(input as HTMLElement).focus();
			}
		}
	}, [isOpen]);

	useEffect(() => {
		reset(stepData);
	}, [stepData, reset]);

	const onSubmit = async (data: CreateStepInput) => {
		setLoading(true);
		try {
			// Добавляем setId в данные, отправляемые на сервер
			const newStep = await createStep({ ...data, setId });
			onStepCreated(newStep);
			removeStepData();
			onClose();
			reset();
		} catch (error) {
			console.error('Ошибка при создании шага:', error);
		} finally {
			setLoading(false);
		}
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

	// Указываем тип для prevData, чтобы избежать ошибок с any
	const handleFieldChange = (field: keyof CreateStepInput, value: any) => {
		setStepData({
			...stepData,
			[field]: value,
		});
	};

	return (
		<div
			className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'
			onClick={handleOverlayClick}
			aria-modal='true'
			role='dialog'
		>
			<div
				className='bg-white p-6 rounded-md max-w-md w-full'
				ref={modalContentRef}
				onClick={e => e.stopPropagation()}
			>
				<h2 className='text-xl font-bold mb-4'>Add New Step</h2>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className='mb-4'>
						<label className='block text-sm font-medium'>Title</label>
						<Input
							{...register('title')}
							value={stepData.title}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								handleFieldChange('title', e.target.value)
							}
							placeholder='Enter step title'
						/>
						{errors.title && (
							<p className='text-red-500'>{errors.title.message}</p>
						)}
					</div>

					<div className='mb-4'>
						<label className='block text-sm font-medium'>Description</label>
						<Textarea
							{...register('description')}
							value={stepData.description}
							onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
								handleFieldChange('description', e.target.value)
							}
							placeholder='Enter step description'
						/>
						{errors.description && (
							<p className='text-red-500'>{errors.description.message}</p>
						)}
					</div>

					<div className='mb-4'>
						<label className='block text-sm font-medium'>Order</label>
						<Input
							type='number'
							{...register('order', { valueAsNumber: true })}
							value={stepData.order}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								handleFieldChange('order', Number(e.target.value))
							}
							placeholder='Enter step order'
						/>
						{errors.order && (
							<p className='text-red-500'>{errors.order.message}</p>
						)}
					</div>

					<div className='mb-4'>
						<label className='block text-sm font-medium'>Element ID</label>
						<Input
							{...register('elementId')}
							value={stepData.elementId}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								handleFieldChange('elementId', e.target.value)
							}
							placeholder='Enter element ID'
						/>
						{errors.elementId && (
							<p className='text-red-500'>{errors.elementId.message}</p>
						)}
					</div>

					<div className='mb-4'>
						<label className='block text-sm font-medium'>Page URL</label>
						<Input
							{...register('pageUrl')}
							value={stepData.pageUrl}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								handleFieldChange('pageUrl', e.target.value)
							}
							placeholder='Enter page URL'
						/>
						{errors.pageUrl && (
							<p className='text-red-500'>{errors.pageUrl.message}</p>
						)}
					</div>

					<div className='mb-4'>
						<label className='block text-sm font-medium'>Image URL</label>
						<Input
							{...register('imageUrl')}
							value={stepData.imageUrl || ''}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								handleFieldChange('imageUrl', e.target.value)
							}
							placeholder='Enter image URL'
						/>
					</div>

					<div className='flex items-center mb-4'>
						<label className='mr-2'>Image Checked</label>
						<input
							type='checkbox'
							{...register('imageChecked')}
							checked={stepData.imageChecked}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								handleFieldChange('imageChecked', e.target.checked)
							}
						/>
					</div>

					<div className='mb-4'>
						<label className='block text-sm font-medium'>Image Height</label>
						<Input
							type='number'
							{...register('imageHeight')}
							value={stepData.imageHeight || ''}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								handleFieldChange('imageHeight', Number(e.target.value))
							}
							placeholder='Enter image height'
						/>
					</div>

					<div className='mb-4'>
						<label className='block text-sm font-medium'>Image Width</label>
						<Input
							type='number'
							{...register('imageWidth')}
							value={stepData.imageWidth || ''}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								handleFieldChange('imageWidth', Number(e.target.value))
							}
							placeholder='Enter image width'
						/>
					</div>

					<div className='flex justify-end'>
						<Button variant='ghost' onClick={onClose}>
							Cancel
						</Button>
						<Button type='submit' className='ml-4' disabled={loading}>
							{loading ? 'Adding...' : 'Add Step'}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};
