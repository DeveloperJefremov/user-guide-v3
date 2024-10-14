import React from 'react';
import { getGuideSets } from './actions/set';
import { GuideSetList } from './components/GuideSetList';

const GuideSets = async () => {
	const sets = await getGuideSets();
	return (
		<div className='overflow-y-auto'>
			<GuideSetList initialSets={sets} />
		</div>
	);
};

export default GuideSets;
