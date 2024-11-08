// components/ui/IframeDisplay.tsx
'use client';

import React from 'react';
import { useIframe } from '../context/IframeContext';

interface IframeDisplayProps {
	title: string;
}

function IframeDisplay({ title }: IframeDisplayProps) {
	const { iframeUrl } = useIframe();

	return (
		<iframe
			src={iframeUrl}
			title={title}
			className='w-3/4 h-3/4 border border-gray-300 rounded'
		></iframe>
	);
}

export default IframeDisplay;
