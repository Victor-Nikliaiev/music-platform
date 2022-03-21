import { MainLayout } from 'src/shared/layouts/main-layout';

// import { MainLayout } from "@app/shared/layouts/main-layout";

export default function Index() {
	return (
		<>
			<MainLayout>
				<div className='center'>
					<h1>Welcome!</h1>
					<h3>Here we've got best of the best of our tracks!</h3>
				</div>
			</MainLayout>
			<style jsx>
				{`
					.center {
						margin-top: 150px;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
					}
				`}
			</style>
		</>
	);
}
