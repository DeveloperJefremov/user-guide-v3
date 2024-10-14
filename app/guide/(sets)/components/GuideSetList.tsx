// components/guide/GuideSetList.tsx

'use client';

import { Button } from '@/components/ui/button';
import { Set } from '@prisma/client';
import React, { useState } from 'react';
import { AddSetModal } from './AddSetModal';
import { GuideSet } from './GuideSet';

interface GuideSetListProps {
	initialSets: Set[];
}

export const GuideSetList = ({ initialSets }: GuideSetListProps) => {
	const [sets, setSets] = useState<Set[]>(initialSets);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleAddTutorial = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const handleSetCreated = (newSet: Set) => {
		setSets(prevSets => [...prevSets, newSet]);
		setIsModalOpen(false);
	};

	return (
		<div>
			<div className='flex justify-between items-center'>
				<h1>Tutorial List:</h1>
				<Button onClick={handleAddTutorial}>Add Tutorial</Button>
			</div>
			<div>
				{sets.map(set => (
					<GuideSet key={set.id} set={set} />
				))}
			</div>

			{isModalOpen && (
				<AddSetModal
					isOpen={isModalOpen}
					onClose={handleCloseModal}
					onSetCreated={handleSetCreated}
				/>
			)}
		</div>
	);
};
