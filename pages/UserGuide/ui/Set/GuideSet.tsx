import { Status } from '@prisma/client';
import { useState } from 'react';

import { SetWithSteps } from '@/lib/types/types';
import { SetFooter } from './SetFooter';
import { SetHeader } from './SetHeader';
import { GuideStepsList } from './Step/GuideStepList';

interface GuideSetProps {
	set: SetWithSteps;
	onDelete: (setId: number) => void;
	onEdit: (set: SetWithSteps) => void;
	onChangeStatus?: (setId: number, newStatus: Status) => void;
	deleteImageFromStorage: (imagePath: string) => void;
}

export const GuideSet = ({
	set,
	onDelete,
	onEdit,
	onChangeStatus,
	deleteImageFromStorage,
}: GuideSetProps) => {
	const [isExpanded, setIsExpanded] = useState<boolean>(false);
	const [isLaunching, setIsLaunching] = useState<boolean>(false);

	const handleDelete = () => {
		onDelete(set.id);
	};

	const handleEdit = () => {
		onEdit(set);
	};

	const handleStatusChange = (setId: number, newStatus: Status) => {
		if (onChangeStatus) {
			onChangeStatus(setId, newStatus);
		}
		// Дополнительная логика при необходимости
	};
	const toggleExpand = () => {
		setIsExpanded(prev => !prev);
	};

	const handleLaunch = () => {
		setIsLaunching(true);
	};

	return (
		<div>
			<div className='border p-8 m-24'>
				<SetHeader
					setTitle={set.title}
					setId={set.id}
					status={set.status}
					onDelete={handleDelete}
					onEdit={handleEdit}
					onChangeStatus={handleStatusChange}
					isExpanded={isExpanded}
					onToggleExpand={toggleExpand}
				/>
				<div
					className={`transition-all duration-300 ease-in-out ${
						isExpanded ? 'max-h-screen' : 'max-h-0 overflow-hidden'
					}`}
				>
					<GuideStepsList
						steps={set.steps}
						setId={set.id}
						isLaunching={isLaunching}
						setIsLaunching={setIsLaunching}
						deleteImageFromStorage={deleteImageFromStorage}
					/>
					<SetFooter onLaunch={handleLaunch} />
				</div>
			</div>
		</div>
	);
};
