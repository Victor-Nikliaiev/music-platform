import { Card, Grid, IconButton } from '@material-ui/core';
import { FC } from 'react';
import { ITrack } from 'types/track';
import styles from 'styles/TrackItem.module.scss';
import { Delete, Pause, PlayArrow } from '@material-ui/icons';
import { useRouter } from 'next/router';
import { useActions } from 'src/shared/hooks/useActions';
import { useDispatch } from 'react-redux';
import { NextThunkDispatch, wrapper } from 'store';
import {
	fetchTracks,
	removeTrack,
	removeTrackFromAlbum,
} from 'store/actions-creators/track';
import { useTypedSelector } from 'src/shared/hooks/useTypedSelector';
// import { fetchAlbums } from 'src/store/actions-creators/albums';
// import { getAudio } from '../Player/Player';

import { SelectAlbum } from './lib/SelectAlbum';
import { getAudio } from '../player/Player';

interface TrackItemProps {
	track: ITrack;
	active?: boolean;
	itemIndex: number;
}
export const ItemForAlbum: FC<TrackItemProps> = ({
	track,
	active = false,
	itemIndex,
}) => {
	const router = useRouter();
	const { pauseTrack, playTrack, setActiveTrack } = useActions();
	const dispatch = useDispatch() as NextThunkDispatch;
	const { activeAlbum } = useTypedSelector(state => state.album);
	const { active: activeTrack } = useTypedSelector(state => state.player);

	const play = e => {
		e.stopPropagation();
		if (activeTrack?._id === track._id) {
			pauseTrack();
			setActiveTrack(null);
			const audio = getAudio();
			audio.src = '';

			return;
		}

		setActiveTrack(track);
		playTrack();
	};

	const deleteTrackFromAlbum = async e => {
		e.stopPropagation();

		try {
			const albumId = track?.album?._id ? track?.album?._id : activeAlbum?._id;
			if (albumId) {
				await dispatch(await removeTrackFromAlbum(albumId, track._id));
			}
			await dispatch(await fetchTracks());
		} catch (err) {
			console.log(err.message);
		}
	};

	return (
		<Card
			className={styles.track}
			onClick={() => router.push(`/tracks/${track._id}`)}
		>
			<IconButton onClick={play}>
				{activeTrack?._id === track._id ? <Pause /> : <PlayArrow />}
			</IconButton>
			<p
				style={{
					margin: '0 0.5em',
					color: '#6d6d6d',
				}}
			>
				{itemIndex < 10 ? '0' + (itemIndex + 1) : itemIndex + 1}
			</p>
			<img
				width={30}
				height={30}
				src={'http://localhost:5000/' + track.picture}
			/>
			<Grid
				container
				direction='column'
				style={{ width: 200, margin: '0 20px' }}
			>
				<div>{track.name}</div>
				<div style={{ fontSize: 12, color: 'gray' }}> {track.artist}</div>
				{track.album?.name && (
					<div style={{ fontSize: 12, color: 'gray' }}>{track.album?.name}</div>
				)}
			</Grid>
			{/* {active && <div> 02: 42 / 03:32</div>} */}
			<SelectAlbum track={track} />
			<IconButton
				onClick={e => deleteTrackFromAlbum(e)}
				style={{ marginLeft: 'auto' }}
			>
				<Delete />
			</IconButton>
		</Card>
	);
};
