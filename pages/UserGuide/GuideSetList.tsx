'use client';

import { Button } from '@/components/ui/button';
import { storage } from '@/lib/store/firebase';
import { SetWithSteps } from '@/lib/types/types';
import { Status } from '@prisma/client';
import { deleteObject, ref } from 'firebase/storage';
import { Reorder } from 'framer-motion';
import { useEffect, useState } from 'react';
import { deleteSet, getGuideSets, updateSetsOrder } from './data/set';
import { GuideSet } from './ui/Set/GuideSet';
import { SetModal } from './ui/Set/SetModal';
import { StatusFilter } from './ui/Set/StatusFilter';

export const GuideSetList = () => {
	const [sets, setSets] = useState<SetWithSteps[]>([]);
	const [filteredSets, setFilteredSets] = useState<SetWithSteps[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedSet, setSelectedSet] = useState<SetWithSteps | null>(null);
	const [filterStatus, setFilterStatus] = useState<Status | 'ALL'>('ALL'); // Начальный статус - "ALL"

	async function fetchSets() {
		try {
			const sets = await getGuideSets();
			setSets(sets);
			setFilteredSets(sets); // Изначально отображаем все сеты
		} catch (error) {
			console.error('Ошибка при получении сетов:', error);
		}
	}

	useEffect(() => {
		fetchSets();
	}, []);

	// Функция для фильтрации сетов по статусу
	useEffect(() => {
		if (filterStatus === 'ALL') {
			setFilteredSets(sets); // Если "ALL", отображаем все сеты
		} else {
			setFilteredSets(sets.filter(set => set.status === filterStatus));
		}
	}, [filterStatus, sets]);

	const handleCreateSet = (newSet?: SetWithSteps) => {
		if (newSet) {
			setSets(prevSets => [...prevSets, newSet]);
		}
		setIsModalOpen(false);
		setSelectedSet(null);
	};

	const deleteImageFromStorage = async (imageUrl: string) => {
		try {
			const fileRef = ref(storage, imageUrl);
			await deleteObject(fileRef);
		} catch (error) {
			console.error(
				'Ошибка при удалении изображения из Firebase Storage:',
				error
			);
		}
	};

	const handleDeleteSet = async (setId: number) => {
		const previousSets = sets;
		const setToDelete = sets.find(set => set.id === setId);

		// Удаление всех изображений шагов, если они существуют
		if (setToDelete) {
			for (const step of setToDelete.steps) {
				if (step.imageUrl) {
					await deleteImageFromStorage(step.imageUrl);
				}
			}
		}

		setSets(prevSets => prevSets.filter(set => set.id !== setId));

		try {
			await deleteSet(setId);

			// Очистка данных localStorage для сета и его шагов
			localStorage.removeItem(`editSetTitle_${setId}`);
			localStorage.removeItem(`newStep_${setId}`);
			localStorage.removeItem(`previewUrl_${setId}_new`);

			// Дополнительно можно пройтись по шагам и удалить данные для каждого шага, если они есть
			if (setToDelete) {
				for (const step of setToDelete.steps) {
					localStorage.removeItem(`editStep_${setId}_${step.id}`);
					localStorage.removeItem(`previewUrl_${setId}_${step.id}`);
				}
			}
		} catch (error) {
			setSets(previousSets);
			console.error('Ошибка при удалении сета:', error);
		}
	};

	const handleEditSet = (set: SetWithSteps) => {
		setSelectedSet(set);

		setIsModalOpen(true);
	};

	const handleUpdateSet = (updatedSet: SetWithSteps) => {
		setSets(prevSets =>
			prevSets.map(set => (set.id === updatedSet.id ? updatedSet : set))
		);
		setIsModalOpen(false);
		setSelectedSet(null);
	};

	const handleReorder = async (newOrder: SetWithSteps[]) => {
		setSets(newOrder);

		const updatedSetsOrder = newOrder.map((set, index) => ({
			id: set.id,
			order: index,
		}));

		try {
			await updateSetsOrder(updatedSetsOrder);
		} catch (error) {
			console.error('Ошибка при сохранении нового порядка сетов:', error);
		}
	};

	return (
		<div className='border p-5 m-8 overflow-auto'>
			<div className='flex justify-between items-center'>
				<h1>Tutorial List:</h1>
				<Button onClick={() => setIsModalOpen(true)}>Add Tutorial</Button>
			</div>

			{/* Фильтр по статусам */}
			<StatusFilter
				currentStatus={filterStatus}
				onStatusChange={setFilterStatus}
			/>

			<Reorder.Group axis='y' values={filteredSets} onReorder={handleReorder}>
				{filteredSets.map(set => (
					<Reorder.Item key={set.id} value={set}>
						<GuideSet
							key={set.id}
							set={set}
							onDelete={handleDeleteSet}
							onEdit={handleEditSet}
							deleteImageFromStorage={deleteImageFromStorage}
						/>
					</Reorder.Item>
				))}
			</Reorder.Group>

			{isModalOpen && (
				<SetModal
					isOpen={isModalOpen}
					onClose={() => {
						setIsModalOpen(false);
						setSelectedSet(null);
					}}
					onSetCreated={handleCreateSet}
					onSetUpdated={handleUpdateSet}
					initialData={selectedSet}
				/>
			)}
		</div>
	);
};
