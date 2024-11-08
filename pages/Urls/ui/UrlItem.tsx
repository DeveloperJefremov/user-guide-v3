'use client';

import DeleteButton from '@/components/shared/DeleteButton';
import { Button } from '@/components/ui/button';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { useIframe } from '../context/IframeContext';
import { Url } from '../types/types';
import UrlCreateForm from './UrlCreateForm';

interface Props {
	url: Url;
	onUrlChange: (url: Url) => void;
	onUrlDelete: (id: number) => void;
}
const UrlItem = ({ url, onUrlChange, onUrlDelete }: Props) => {
	const [editingUrl, setEditingUrl] = useState<boolean>(false);
	const { setIframeUrl } = useIframe();
	const saveUrlHandler = (newUrl: Url): void => {
		onUrlChange(newUrl);
		setEditingUrl(false);
	};

	const deleteUrlHandler = (): void => {
		onUrlDelete(url.id);
		setEditingUrl(false);
	};

	const showHideFormHandler = (): void => {
		setEditingUrl(prev => !prev);
	};

	return (
		<li className='flex items-center  gap-4 p-2  outline outline-secondary outline-1 rounded-sm'>
			{!editingUrl ? (
				<>
					<DeleteButton
						size='sm_icon'
						deleteHandler={deleteUrlHandler}
						text='This action cannot be undone. This will permanently delete your Url'
						className='bg-destructive px-[2px]'
					>
						<Trash2Icon size='16' />
					</DeleteButton>

					<Button
						onClick={showHideFormHandler}
						aria-label='edit'
						size='sm_icon'
					>
						<PencilIcon size='16' />
					</Button>
					<span className=' flex items-center  text-center text-xl '>
						{url.url}
					</span>
					<Button
						onClick={() => setIframeUrl(url.url)}
						variant='outline'
						size='sm'
						className='ml-auto'
					>
						View in iframe
					</Button>
				</>
			) : (
				<UrlCreateForm
					onUrlCreated={newUrl => saveUrlHandler(newUrl)}
					url={url}
					onCancel={showHideFormHandler}
				/>
			)}
		</li>
	);
};

export default UrlItem;
