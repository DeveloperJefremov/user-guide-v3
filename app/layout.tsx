import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
	title: 'User Guide',
	description: 'User Guide for app',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body>{children}</body>
			<div id='modal-root'></div>
		</html>
	);
}
