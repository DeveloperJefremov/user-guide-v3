'use client';

import { ReactNode, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
	const modalContentRef = useRef<HTMLDivElement>(null);

	const handleOverlayClick = (event: React.MouseEvent) => {
		if (
			modalContentRef.current &&
			!modalContentRef.current.contains(event.target as Node)
		) {
			onClose();
		}
	};

	useEffect(() => {
		const handleEscapeKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
		};

		if (isOpen) {
			window.addEventListener('keydown', handleEscapeKey);
		}

		return () => {
			window.removeEventListener('keydown', handleEscapeKey);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return ReactDOM.createPortal(
		<div
			className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'
			onClick={handleOverlayClick}
			aria-modal='true'
			role='dialog'
		>
			<div
				className='bg-white p-8 rounded-lg max-w-lg w-full shadow-md'
				ref={modalContentRef}
				onClick={e => e.stopPropagation()} // Останавливаем всплытие клика на контент модалки
			>
				{children}
			</div>
		</div>,
		document.getElementById('modal-root')!
	);
};
