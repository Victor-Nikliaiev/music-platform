import { useTypedSelector } from 'src/shared/hooks';
import { MainLayout } from 'src/shared/layouts/main-layout';
import { Box, Button, Card, Grid, TextField } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { NextThunkDispatch, wrapper } from '../../store';
import { fetchAlbums, searchAlbums } from '../../store/actions-creators/albums';
import { AlbumList } from 'src/entities/album/ui/AlbumList';

const Index = () => {
	const router = useRouter();
	const { albums } = useTypedSelector(state => state.album);
	const [query, setQuery] = useState<string>('');
	const dispatch = useDispatch() as NextThunkDispatch;
	const [timer, setTimer] = useState(null);

	const search = async (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value);
		if (timer) {
			clearTimeout(timer);
		}
		setTimer(
			setTimeout(async () => {
				await dispatch(await searchAlbums(e.target.value));
			}, 1000)
		);
	};

	return (
		<MainLayout title={'Albums | Music App'}>
			<Grid container justifyContent='center'>
				<Card style={{ width: '900px' }}>
					<Box style={{ padding: '1.8rem' }}>
						<Grid container justifyContent='space-between'>
							<h1>Album List</h1>
							<Button onClick={() => router.push('/albums/create')}>
								Create New Album
							</Button>
						</Grid>
					</Box>
					<TextField
						label={'Album search'}
						fullWidth
						value={query}
						onChange={search}
					/>
					<AlbumList albums={albums} />
				</Card>
			</Grid>
		</MainLayout>
	);
};

export default Index;

export const getServerSideProps = wrapper.getServerSideProps(
	async ({ store }) => {
		const dispatch = store.dispatch as NextThunkDispatch;
		await dispatch(await fetchAlbums());
	}
);
