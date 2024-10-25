'use client';

import { Button } from '@/components/ui/button';
import { SetWithSteps } from '@/lib/types/types';
import { Status } from '@prisma/client';
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

	const handleDeleteSet = async (setId: number) => {
		const previousSets = sets;
		setSets(prevSets => prevSets.filter(set => set.id !== setId));
		try {
			await deleteSet(setId);
			localStorage.removeItem(`editSetTitle_${setId}`);
			localStorage.removeItem(`newStep_${setId}`);
			// localStorage.removeItem(`editStep_${setId}_${stepId}`);
			localStorage.removeItem(`previewUrl_${setId}_new`);
			// localStorage.removeItem(`previewUrl_${setId}_${stepId}`);
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
