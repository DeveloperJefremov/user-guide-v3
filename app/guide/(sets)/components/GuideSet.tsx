import { Set } from '@prisma/client';
import { SetFooter } from './SetFooter';
import { SetHeader } from './SetHeader';
interface GuideSetProps {
	set: Set;
}

export const GuideSet = ({ set }: GuideSetProps) => {
	return (
		<div>
			<div className='border p-8 m-24'>
				<SetHeader />
				<h2 className='text-xl font-bold'>{set.title}</h2>
				<p>Status: {set.status}</p>

				<SetFooter />
			</div>
		</div>
	);
};
