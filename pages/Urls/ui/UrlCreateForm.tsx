import { FormError } from '@/components/shared/form-error';
import { Button, buttonVariants } from '@/components/ui/button';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Form, FormProvider, useForm } from 'react-hook-form';
import { Url, UrlForm } from '../types/types';
import { urlFormSchema } from '../zod/urlSchema';

interface Props {
	onUrlCreated: (url: Url) => void;
	onCancel: () => void;
	url?: Url;
}

const UrlCreateForm = ({ onUrlCreated, onCancel, url }: Props) => {
	const initialFormValues: UrlForm = {
		url: '',
		description: [{ id: Math.random(), value: '', order: 0 }],
		status: 'ACTIVE',
		validFrom: new Date(),
		validTo: new Date('4000-01-01'),
		honeyPot: '',
	};
	const initialConfirmedDate =
		url && url.validTo.toISOString().slice(0, 10) !== '4000-01-01'
			? true
			: false;
	const initialValidityPeriod = initialConfirmedDate ? 'from-to' : 'unlimited';
	const [validityPeriod, setValidityPeriod] = useState<'unlimited' | 'from-to'>(
		initialValidityPeriod
	);
	const [isConfirmedDate, setIsConfirmedDate] = useState(initialConfirmedDate);

	const form = useForm<UrlForm>({
		resolver: zodResolver(urlFormSchema),
		defaultValues: url ? { ...url, honeyPot: '' } : initialFormValues,
	});

	const submitHandler = (newUrl: UrlForm): void => {
		// if (!user || !user.id) return;

		const { id, honeyPot, ...restUrl } = newUrl;
		const temporaryId = Math.random();
		const url: Url = {
			...restUrl,
			id: id || temporaryId,
			// userId: user.id,
		};

		onUrlCreated(url);
		form.reset(initialFormValues);
	};

	const onKeyDownHandler = (e: React.KeyboardEvent): void => {
		if (e.key === 'Enter') {
			e.preventDefault();
		}
	};

	const formattedStartDate = form.watch('validFrom')
		? form.watch('validFrom').toLocaleDateString()
		: '';
	const formattedEndDate = form.watch('validTo')
		? form.watch('validTo').toLocaleDateString()
		: '';

	return (
		<FormProvider {...form}>
			<form
				onSubmit={form.handleSubmit(submitHandler)}
				onKeyDown={onKeyDownHandler}
				className='flex flex-col gap-3 w-[450px]'
			>
				<FormField
					control={form.control}
					name='url'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='pl-[2px] '>Url</FormLabel>
							<FormControl>
								<Input className='  text-base mt-[5px] ' {...field} />
							</FormControl>
						</FormItem>
					)}
				/>

				<div className='flex flex-col gap-3'>
					<Label>Description</Label>
					{/* <ListTextarea
						value={form.watch('description') ?? []}
						onChange={newValue => {
							form.setValue('description', newValue);
						}}
					/> */}
				</div>

				<div className='flex flex-col gap-1'>
					<Label className='py-2'>Valid Time </Label>
					<RadioGroup
						defaultValue={validityPeriod}
						onValueChange={(state: 'unlimited' | 'from-to') => {
							if (state === 'unlimited') {
								form.setValue('validFrom', new Date());
								form.setValue('validTo', new Date('4000-01-01'));
								setIsConfirmedDate(false);
							} else {
								form.setValue('validFrom', new Date());
								form.setValue('validTo', new Date());
							}
							setValidityPeriod(state);
						}}
					>
						<div className='flex items-center space-x-2 '>
							<RadioGroupItem
								value='unlimited'
								id='r1'
								className='disabled:cursor-default'
							/>
							<Label htmlFor='r1'>Unlimited</Label>
						</div>
						<div className='flex items-center space-x-2 '>
							<RadioGroupItem
								value='from-to'
								id='r2'
								className='disabled:cursor-default'
							/>
							<Label htmlFor='r1'>From - To</Label>
						</div>
					</RadioGroup>
				</div>

				{validityPeriod === 'from-to' && (
					<>
						<Popover>
							<PopoverTrigger
								className={cn(
									buttonVariants({ variant: 'outline' }),
									'flex justify-around w-full col-span-2 border-none  rounded-none hover:outline hover:outline-1 hover:outline-slate-200 hover:bg-white font-normal '
								)}
							>
								<span>{formattedStartDate}</span>
								{isConfirmedDate ? (
									<span>{formattedEndDate}</span>
								) : (
									<span>Set Time</span>
								)}
							</PopoverTrigger>
							<PopoverContent className='w-auto'>
								{/* <RangeCalendar
									onGetDate={(date: { timeStart: Date; timeEnd: Date }) => {
										form.setValue('validFrom', date.timeStart);
										form.setValue('validTo', date.timeEnd);
									}}
									onEmptyTime='error'
									startDate={form.watch('validFrom')}
									endDate={form.watch('validTo')}
									fixedWeeks
									weekStartsOn={1}
									isConfirmed={isConfirmedDate}
									onConfirm={() => setIsConfirmedDate(true)}
									displayTimeRange={false}
								/> */}
							</PopoverContent>
						</Popover>
					</>
				)}

				<FormField
					control={form.control}
					name='status'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Status</FormLabel>
							<Select onValueChange={field.onChange} value={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='Select a Status' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{PROJECT_TAGS_STATUSES.map((status, index) => (
										<SelectItem key={status.value} value={status.value}>
											{status.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<input {...form.register('honeyPot')} hidden />

				{/* <DevTool control={form.control} /> */}

				<div className='flex gap-3 w-full'>
					<Button variant='outline' type='submit' className='w-full'>
						{url ? 'Save' : 'Create'}
					</Button>

					<Button
						variant='outline'
						type='button'
						className='w-full'
						onClick={() => onCancel()}
					>
						Cancel
					</Button>
				</div>
				{/* {Object.keys(form.formState.errors).map(
					field =>
						form.formState.errors[field] && (
							<FormError
								key={field}
								message={`${field} - ${form.formState.errors[field].message}`}
							/>
						)
				)} */}
			</form>
		</FormProvider>
	);
};

export default UrlCreateForm;

const PROJECT_TAGS_STATUSES = [
	// { value: 'INITIAL', label: '-' },
	{ value: 'ACTIVE', label: 'Active' },
	{ value: 'HIDDEN', label: 'Hidden' },
	{ value: 'INACTIVE', label: 'Inactive' },
	{ value: 'ARCHIVED', label: 'Archived' },
] as const;
