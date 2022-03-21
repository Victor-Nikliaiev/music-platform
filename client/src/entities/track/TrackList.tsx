import { Box, Grid } from '@material-ui/core';
import { FC, useEffect } from 'react';
import { NextThunkDispatch, wrapper } from 'store';

import { fetchAlbums } from 'store/actions-creators/albums';
import { ITrack } from 'types/track';

interface TrackListProps {
	tracks: ITrack[];
	Component: React.FC<any>;
}

export const TrackList: FC<TrackListProps> = ({ tracks, Component }) => {
	const catchAlbums = () => {
		wrapper.getServerSideProps(async ({ store }) => {
			const dispatch = store.dispatch as NextThunkDispatch;
			await dispatch(await fetchAlbums());
		});
	};

	useEffect(() => {
		catchAlbums();
	}, []);

	return (
		<Grid container direction='column'>
			<Box style={{ padding: '1.3rem' }}>
				{tracks.map((track, index) => (
					<Component key={track._id} track={track} itemIndex={index} />
				))}
			</Box>
		</Grid>
	);
};
