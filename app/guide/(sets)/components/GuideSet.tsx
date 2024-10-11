import { Set } from '@prisma/client';
interface GuideSetProps {
	set: Set;
}

export const GuideSet = ({ set }: GuideSetProps) => {
	return (
		<div className='border p-4 mb-4'>
			<h2 className='text-xl font-bold'>{set.title}</h2>
			<p>Status: {set.status}</p>
			{/* Здесь вы можете добавить дополнительные данные сета */}
		</div>
	);
};
