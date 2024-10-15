import { Set, Status } from '@prisma/client';
import { SetFooter } from './SetFooter';
import { SetHeader } from './SetHeader';

interface GuideSetProps {
	set: Set;
	onDelete: (setId: number) => void;
	onEdit: (set: Set) => void;
	onChangeStatus?: (setId: number, newStatus: Status) => void;
}

export const GuideSet = ({
	set,
	onDelete,
	onEdit,
	onChangeStatus,
}: GuideSetProps) => {
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
				/>

				<p>Status: {set.status}</p>

				<SetFooter />
			</div>
		</div>
	);
};
