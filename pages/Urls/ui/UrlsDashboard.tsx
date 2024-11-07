'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';

const UrlsDashboard = () => {
	const [isShownForm, setIsShownForm] = useState(false);

	// useEffect для возможного начального получения данных
	// useEffect(() => {
	// 	let isMounted = true;
	// 	if (!tags) {
	// 		fetchTags(() => isMounted);
	// 	}
	// 	return () => {
	// 		isMounted = false;
	// 	};
	// }, []);

	// Функция для создания нового тега (пример обработки)
	// const createNewTagHandler = (newTag: Url) => {
	// 	setIsShownForm(false);
	// 	createUrl(newTag);
	// };

	// Функция для удаления тега
	// const deleteTagHandler = (id: number) => {
	// 	deleteUrl(id);
	// };

	// Функция для обновления тега
	// const updateTagHandler = (updatedTag: Url) => {
	// 	editUrl(updatedTag);
	// };

	return (
		<div className='flex h-screen'>
			{/* Левая сторона экрана для UI компонентов */}
			<div className='w-1/2 border-r p-4'>
				<div className='flex flex-col gap-4'>
					{/* Карточка для создания нового тега */}
					<Card className='p-3'>
						<CardHeader>
							<CardTitle>Create New Tag</CardTitle>
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
								<span>Форма создания тега</span>
								// <TagCreateForm
								// 	onTagCreated={createNewTagHandler}
								// 	onCancel={() => setIsShownForm(false)}
								// />
							)}
						</CardContent>
					</Card>

					{/* Блок для отображения ошибок */}
					{/* {error && <FormError message={error} />} */}

					{/* Карточка для отображения существующих тегов */}
					<Card>
						<CardHeader>
							<CardTitle>Tags</CardTitle>
						</CardHeader>
						<CardContent className='flex flex-col items-start gap-6'>
							{/* Проверка на наличие тегов и отображение списка */}
							{/* {isLoading && <span>Loading...</span>}
							{tags !== null && !!tags.length && !isLoading ? (
								<ul className='flex flex-col gap-4'>
									{tags.map((tag: Tag, index: number) => (
										// <TagItem
										// 	key={tag.id + tag.title}
										// 	tag={tag}
										// 	onTagChange={updateTagHandler}
										// 	onTagDelete={deleteTagHandler}
										// />
									))}
								</ul> */}
							{/* ) : ( */}
							<span>No Url's</span>
							{/* )} */}
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Правая половина экрана с iframe по центру */}
			<div className='w-1/2 flex items-center justify-center'>
				<iframe
					src='https://nextjs.org/' // Замените на нужный URL
					className='w-3/4 h-3/4'
					title='External Content'
				></iframe>
			</div>
		</div>
	);
};

export default UrlsDashboard;
