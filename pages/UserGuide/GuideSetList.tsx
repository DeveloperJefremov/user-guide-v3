'use client';

import { Button } from '@/components/ui/button';
import { SetWithSteps } from '@/lib/types/types';
import { Set } from '@prisma/client';
import { Reorder } from 'framer-motion';
import { useEffect, useState } from 'react';
import { deleteSet, getGuideSets, updateSet } from './data/set';
import { GuideSet } from './ui/Set/GuideSet';
import { SetModal } from './ui/Set/SetModal';

export const GuideSetList = () => {
	const [sets, setSets] = useState<SetWithSteps[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedSet, setSelectedSet] = useState<SetWithSteps | null>(null);

	async function fetchSets() {
		try {
			const sets = await getGuideSets();
			setSets(sets);
		} catch (error) {
			console.error('Ошибка при получении сетов:', error);
		}
	}

	useEffect(() => {
		fetchSets();
	}, []);

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
			// Удаляем сохраненные данные для этого сета из localStorage
			localStorage.removeItem(`editSetTitle_${setId}`);
			localStorage.removeItem(`newStep_${setId}`);
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

	return (
		<div className='border p-5 m-8 overflow-auto'>
			<div className='flex justify-between items-center'>
				<h1>Tutorial List:</h1>
				<Button onClick={() => setIsModalOpen(true)}>Add Tutorial</Button>
			</div>

			<Reorder.Group axis='y' values={sets} onReorder={setSets}>
				{sets.map(set => (
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
