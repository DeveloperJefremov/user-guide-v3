// app/guide/page.tsx

import React from 'react';
import GuideSets from './(sets)';

const GuidePage = async () => {
	return (
		<main>
			<h1>Доступные сеты</h1>
			<GuideSets />
		</main>
	);
};

export default GuidePage;
