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
import { Textarea } from '@/components/ui/textarea';
import { useLocalStorage } from '@/lib/hooks/useLocaleStorage';
import { CreateStepInput, createStepSchema } from '@/lib/zod/stepSchema';
import { createStep } from '@/pages/UserGuide/sets/data/step';
import { zodResolver } from '@hookform/resolvers/zod';
import { Step } from '@prisma/client';
import { useEffect, useRef, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

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
				<FormProvider {...methods}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<FormField
							name='title'
							control={control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input {...field} placeholder='Enter step title' />
									</FormControl>
									{errors.title && (
										<FormMessage>{errors.title.message}</FormMessage>
									)}
								</FormItem>
							)}
						/>

						<FormField
							name='description'
							control={control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea {...field} placeholder='Enter step description' />
									</FormControl>
									{errors.description && (
										<FormMessage>{errors.description.message}</FormMessage>
									)}
								</FormItem>
							)}
						/>

						<FormField
							name='order'
							control={control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Order</FormLabel>
									<FormControl>
										<Input
											type='number'
											{...field}
											placeholder='Enter step order'
										/>
									</FormControl>
									{errors.order && (
										<FormMessage>{errors.order.message}</FormMessage>
									)}
								</FormItem>
							)}
						/>

						<FormField
							name='elementId'
							control={control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Element ID</FormLabel>
									<FormControl>
										<Input {...field} placeholder='Enter element ID' />
									</FormControl>
									{errors.elementId && (
										<FormMessage>{errors.elementId.message}</FormMessage>
									)}
								</FormItem>
							)}
						/>

						<FormField
							name='pageUrl'
							control={control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Page URL</FormLabel>
									<FormControl>
										<Input {...field} placeholder='Enter page URL' />
									</FormControl>
									{errors.pageUrl && (
										<FormMessage>{errors.pageUrl.message}</FormMessage>
									)}
								</FormItem>
							)}
						/>

						<FormField
							name='imageUrl'
							control={control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Image URL</FormLabel>
									<FormControl>
										<Input {...field} placeholder='Enter image URL' />
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							name='imageChecked'
							control={control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Image Checked</FormLabel>
									<FormControl>
										<input
											type='checkbox'
											checked={field.value}
											onChange={field.onChange}
											ref={field.ref}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							name='imageHeight'
							control={control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Image Height</FormLabel>
									<FormControl>
										<Input
											type='number'
											{...field}
											placeholder='Enter image height'
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							name='imageWidth'
							control={control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Image Width</FormLabel>
									<FormControl>
										<Input
											type='number'
											{...field}
											placeholder='Enter image width'
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<div className='flex justify-end'>
							<Button variant='ghost' onClick={onClose}>
								Cancel
							</Button>
							<Button type='submit' className='ml-4' disabled={loading}>
								{loading ? 'Adding...' : 'Add Step'}
							</Button>
						</div>
					</form>
				</FormProvider>
			</div>
		</div>
	);
};
