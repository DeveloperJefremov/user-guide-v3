// components/guide/GuideSetList.tsx

import { Set } from '@prisma/client';
import React from 'react';
import { GuideSet } from './GuideSet';

interface GuideSetListProps {
	sets: Set[];
}

export const GuideSetList = ({ sets }: GuideSetListProps) => {
	return (
		<div>
			{sets.map(set => (
				<GuideSet key={set.id} set={set} />
			))}
		</div>
	);
};
