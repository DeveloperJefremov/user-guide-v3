import { TriangleAlert } from 'lucide-react';

interface FormErrorProps {
	message?: string | null;
}

export const FormError = ({ message }: FormErrorProps) => {
	if (!message) return null;

	return (
		<div className='bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive'>
			<TriangleAlert className='h-4 w-4' />
			<span>{message}</span>
		</div>
	);
};
