'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import { createUrl, deleteUrl, editUrl, fetchUrls } from './data/url';
import { Url } from './types/types';
import UrlCreateForm from './ui/UrlCreateForm';
import UrlItem from './ui/UrlItem';

const UrlsDashboard = () => {
	const [isShownForm, setIsShownForm] = useState(false);
	const [urls, setUrls] = useState<Url[]>([]);

	useEffect(() => {
		const loadUrls = async () => {
			const fetchedUrls = await fetchUrls();

			setUrls(fetchedUrls);
		};
		loadUrls();
	}, []);

	const createUrlTagHandler = async (newTag: Url) => {
		setIsShownForm(false);
		await createUrl(newTag);
		const updatedUrls = await fetchUrls();
		setUrls(updatedUrls);
	};

	const deleteUrlHandler = async (id: number) => {
		await deleteUrl(id); // Удаляем URL
		const updatedUrls = await fetchUrls(); // Загружаем актуальный список
		setUrls(updatedUrls); // Обновляем состояние
	};

	const updateUrlHandler = async (updatedTag: Url) => {
		await editUrl(updatedTag); // Обновляем URL в базе данных
		const updatedUrls = await fetchUrls(); // Загружаем актуальный список
		setUrls(updatedUrls); // Обновляем состояние
	};

	return (
		<div className='flex h-screen'>
			{/* Левая сторона экрана для UI компонентов */}
			<div className='w-1/2 border-r p-4'>
				<div className='flex flex-col gap-4'>
					{/* Карточка для создания нового тега */}
					<Card className='p-3'>
						<CardHeader>
							<CardTitle>Create New Url</CardTitle>
						</CardHeader>
						<CardContent className='flex justify-start gap-4 pt-3'>
							{!isShownForm ? (
								<Button
									variant='outline'
									onClick={() => setIsShownForm(prev => !prev)}
								>
									Create New
								</Button>
							) : (
								<>
									<span>Url adding form</span>
									<UrlCreateForm
										onUrlCreated={createUrlTagHandler}
										onCancel={() => setIsShownForm(false)}
									/>
								</>
							)}
						</CardContent>
					</Card>

					{/* Блок для отображения ошибок */}
					{/* {error && <FormError message={error} />} */}

					{/* Карточка для отображения существующих тегов */}
					<Card>
						<CardHeader>
							<CardTitle>Urls</CardTitle>
						</CardHeader>

						<CardContent className='flex flex-col items-start gap-6'>
							{urls !== null && !!urls.length ? (
								<ul className='flex flex-col gap-4'>
									{urls.map((url: Url, index: number) => (
										<UrlItem
											key={url.id + url.url}
											url={url}
											// type={'projectTag'}
											onUrlChange={updateUrlHandler}
											onUrlDelete={deleteUrlHandler}
										/>
									))}
								</ul>
							) : (
								<span>No Urls</span>
							)}
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Правая половина экрана с iframe по центру */}
			<div className='w-1/2 flex items-center justify-center'>
				<iframe
					src='http://localhost:3000/tutorials' // Замените на нужный URL
					className='w-3/4 h-3/4'
					title='External Content'
				></iframe>
			</div>
		</div>
	);
};

export default UrlsDashboard;
