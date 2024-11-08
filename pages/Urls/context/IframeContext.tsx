// components/context/IframeContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface IframeContextType {
	iframeUrl: string;
	setIframeUrl: (url: string) => void;
}

const IframeContext = createContext<IframeContextType | undefined>(undefined);

export const IframeProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [iframeUrl, setIframeUrl] = useState(
		'https://timepulse-core.vercel.app/products/timetracker'
	); // начальный URL

	return (
		<IframeContext.Provider value={{ iframeUrl, setIframeUrl }}>
			{children}
		</IframeContext.Provider>
	);
};

export const useIframe = (): IframeContextType => {
	const context = useContext(IframeContext);
	if (!context) {
		throw new Error('useIframe must be used within an IframeProvider');
	}
	return context;
};
