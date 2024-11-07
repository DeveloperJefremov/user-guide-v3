// import LandingPage from './(logged-out)/page';

import FirstSideBar from '@/components/shared/FirstSideBar';

interface Props {
	className?: string;
}
const Home = ({ className }: Props) => {
	return (
		<div className='grid grid-rows-[100vh_1fr] grid-cols-[150px_1fr] h-screen'>
			<FirstSideBar />
			{/* <GuideSetList /> */}
		</div>
	);
};

export default Home;
