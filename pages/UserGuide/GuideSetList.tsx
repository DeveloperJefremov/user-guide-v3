'use client';

import { Button } from '@/components/ui/button';
import { Set } from '@prisma/client';
import { Reorder } from 'framer-motion';
import { useEffect, useState } from 'react';
import { deleteSet, getGuideSets, updateSet } from './data/set';
import { GuideSet } from './ui/GuideSet';
import { SetModal } from './ui/SetModal';

export const GuideSetList = () => {
	const [sets, setSets] = useState<Set[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedSet, setSelectedSet] = useState<Set | null>(null);

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

	const handleCreateSet = (newSet?: Set) => {
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
		} catch (error) {
			setSets(previousSets);
			console.error('Ошибка при удалении сета:', error);
		}
	};

	const handleEditSet = (set: Set) => {
		setSelectedSet(set);
		setIsModalOpen(true);
	};

	const handleUpdateSet = (updatedSet: Set) => {
		setSets(prevSets =>
			prevSets.map(set => (set.id === updatedSet.id ? updatedSet : set))
		);
		setIsModalOpen(false);
		setSelectedSet(null);
	};

	return (
		<div>
			<div className='flex justify-between items-center'>
				<h1>Tutorial List:</h1>
				<Button onClick={() => setIsModalOpen(true)}>Add Tutorial</Button>
			</div>
			<div>
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
			</div>

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
