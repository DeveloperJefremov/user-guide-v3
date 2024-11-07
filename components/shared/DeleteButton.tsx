'use client';

import { Trash2Icon } from 'lucide-react';
import React from 'react';

import { cn } from '@/lib/utils';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '../ui/alert-dialog';
import { buttonVariants } from '../ui/button';

//TODO: Need rename component to

interface Props {
	children?: React.ReactNode;
	text?: string;
	variant?: string;
	size?: 'icon' | 'small' | 'medium' | 'large' | 'sm_icon';
	deleteHandler: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	className?: string;
	disabled?: boolean;
	asChild?: boolean;
	open?: boolean;
	onOpenChange?: (value: boolean) => void;
	displayTriggerButton?: boolean;
	buttonLabel?: string;
}
const DeleteButton = ({
	children,
	text = 'This action cannot be undone. This will permanently delete it',
	variant = 'outline',
	size = 'sm_icon',
	deleteHandler,
	disabled = false,
	className,
	asChild = false,
	open,
	onOpenChange,
	displayTriggerButton = true,
	buttonLabel = 'Delete',
}: Props) => {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogTrigger
				className={cn(
					!asChild &&
						buttonVariants({
							variant: variant as any,
							size: size as any,
						}),
					'bg-destructive px-[2px]',
					className
				)}
				aria-label='delete'
				type='button'
				disabled={disabled}
				hidden={!displayTriggerButton}
			>
				{children || <Trash2Icon className='h-4 w-4' />}
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>{text}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						className={buttonVariants({
							variant: 'destructive',
						})}
						onClick={e => deleteHandler(e)}
					>
						{buttonLabel}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteButton;
