import React from 'react';
import { getGuideSets } from './actions/set';
import { GuideSetList } from './components/GuideSetList';
import { SetFooter } from './components/SetFooter';
import { SetHeader } from './components/SetHeader';

const GuideSets = async () => {
	const sets = await getGuideSets();
	return (
		<div>
			<SetHeader />
			<GuideSetList sets={sets} />
			<SetFooter />
		</div>
	);
};

export default GuideSets;
