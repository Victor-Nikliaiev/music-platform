import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useActions } from 'src/shared/hooks/useActions';
import { useTypedSelector } from 'src/shared/hooks/useTypedSelector';
import { NextThunkDispatch, wrapper } from '../../store';
import { fetchAlbums } from '../../store/actions-creators/albums';
import { IAlbum } from '../../types/albums';
import { Grid } from '@material-ui/core';
import {
	AlbumDescription,
	AlbumHeader,
	AlbumPicture,
} from 'src/entities/album/ui';
import { AlbumTrackList } from 'src/entities/album/ui/AlbumTrackList';
import { MainLayout } from 'src/shared/layouts/main-layout';

interface AlbumPageProps {
	serverAlbum: IAlbum;
}

const AlbumPage: React.FC<AlbumPageProps> = ({ serverAlbum }) => {
	const [thisAlbum, setThisAlbum] = useState<IAlbum>(serverAlbum);
	const { tracks } = useTypedSelector(state => state.track);
	const { setActiveAlbum } = useActions();

	setActiveAlbum(serverAlbum);

	useEffect(() => {
		if (
			thisAlbum.tracks.length === serverAlbum.tracks.length &&
			tracks.length === 0
		)
			return;
		refreshAlbumData();
	}, [tracks]);

	useEffect(() => {
		if (serverAlbum) {
			setActiveAlbum(serverAlbum);
		}
	}, []);

	const findTracksBelongedToThisAlbum = () => {
		const belongedTracks = tracks.filter(track => {
			return track.album?._id === thisAlbum._id;
		});
		return belongedTracks;
	};

	const refreshAlbumData = () => {
		const belongedTracks = findTracksBelongedToThisAlbum();
		setThisAlbum({ ...thisAlbum, tracks: belongedTracks });
	};

	return (
		<MainLayout
			title={`Music App | ${thisAlbum.author} - ${thisAlbum.name}`}
			keywords={`music, albums, artists, ${thisAlbum.name}, ${thisAlbum.author}`}
		>
			<AlbumHeader />
			<Grid container style={{ margin: '20px 0' }}>
				<AlbumPicture thisAlbum={thisAlbum} />
				<AlbumDescription thisAlbum={thisAlbum} setThisAlbum={setThisAlbum} />
			</Grid>

			<AlbumTrackList thisAlbum={thisAlbum} />
		</MainLayout>
	);
};

export default AlbumPage;

export const getServerSideProps = wrapper.getServerSideProps(
	async ({ store, params }) => {
		const dispatch = store.dispatch as NextThunkDispatch;
		await dispatch(await fetchAlbums());
		const responseAlbum = await axios.get(
			'http://localhost:5000/albums/' + params.id
		);
		return {
			props: {
				serverAlbum: responseAlbum.data,
			},
		};
	}
);
