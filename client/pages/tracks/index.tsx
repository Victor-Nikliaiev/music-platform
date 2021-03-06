// import MainLayout from "../../shared/layouts/main-layout/MainLayout";
import { Box, Button, Card, Grid, TextField } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useCallback, useRef, useState } from 'react';
import { ITrack } from '../../types/track';
// iamport { TrackList } from "../../components/Track";
TrackList;

// import { useTypedSelector } from '../../shared/hooks/useTypedSelector';
// import { useActions } from '../../shared/hooks/useActions';

import { NextThunkDispatch, wrapper } from '../../store';
import { fetchTracks, searchTracks } from '../../store/actions-creators/track';
import { useDispatch } from 'react-redux';

import { fetchAlbums } from '../../store/actions-creators/albums';

import { ItemForTrack, TrackList } from 'src/entities/track';

import { useFetchTracks } from 'src/entities/player/hooks';
import { MainLayout } from 'src/shared/layouts/main-layout';
import { useActions, useTypedSelector } from 'src/shared/hooks';

const Index = () => {
	const router = useRouter();
	const { tracks, error } = useTypedSelector(state => state.track);
	const [fetchedTracks, setFetchedTracks] = useState<ITrack[]>(tracks || []);
	const [query, setQuery] = useState<string>('');
	const dispatch = useDispatch() as NextThunkDispatch;
	const [timer, setTimer] = useState(null);

	const [trackCount, setTrackCount] = useState(10);
	const observer = useRef(null);

	const {
		loading,
		error: fetchedTrackError,
		tracks: dynamicallyFetchedTracks,
	} = useFetchTracks(trackCount);

	const lastTrackElementRef = useCallback(
		node => {
			if (loading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver(entries => {
				if (entries[0].isIntersecting) {
					setTrackCount(prevTrackCount => prevTrackCount + 10);
				}
			});
			if (node) observer.current.observe(node);
		},
		[loading]
	);

	const search = async (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value);
		if (timer) {
			clearTimeout(timer);
		}
		setTimer(
			setTimeout(async () => {
				await dispatch(await searchTracks(e.target.value));
			}, 1000)
		);
	};

	if (error) {
		return (
			<MainLayout>
				<h1>{error}</h1>
			</MainLayout>
		);
	}
	return (
		<MainLayout title={'Track List | Music App'}>
			<Grid container justifyContent='center'>
				<Card style={{ width: '900px' }}>
					<Box style={{ padding: '1.8rem' }}>
						<Grid container justifyContent='space-between'>
							<h1>Track List</h1>
							<Button onClick={() => router.push('/tracks/create')}>
								Load New Track
							</Button>
						</Grid>
					</Box>
					<TextField
						label={'Track search'}
						fullWidth
						value={query}
						onChange={search}
					/>
					<TrackList tracks={tracks} Component={ItemForTrack} />

					<Grid container justifyContent='center'></Grid>
				</Card>
			</Grid>
		</MainLayout>
	);
};

export default Index;

export const getServerSideProps = wrapper.getServerSideProps(
	async ({ store }) => {
		const dispatch = store.dispatch as NextThunkDispatch;
		await dispatch(await fetchTracks());
		await dispatch(await fetchAlbums());
	}
);
