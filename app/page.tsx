// import LandingPage from './(logged-out)/page';

import FirstSideBar from '@/components/shared/FirstSideBar';
import Guide from './guide/page';

interface Props {
	className?: string;
}
const Home = ({ className }: Props) => {
	return (
		<div className='grid grid-rows-[100vh_1fr] grid-cols-[100px_1fr] h-screen'>
			{/* <LandingPage /> */}
			<FirstSideBar />
			<Guide />
		</div>
	);
};

export default Home;
