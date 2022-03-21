import React, { useState } from 'react';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import styles from './ChangeAudioModal.module.scss';
import SlowMotionVideoIcon from '@material-ui/icons/SlowMotionVideo';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import { Button, Grid, IconButton } from '@material-ui/core';
import { ITrack } from 'types/track';
import { updateTrack } from 'store/actions-creators/track';
import { useDispatch } from 'react-redux';
import { NextThunkDispatch } from 'store';
import { FileUpload } from 'src/shared/lib';

interface ChangeAudioProps {
	isModalOpen: boolean;
	closeModal: Function;
	track: ITrack;
}

export const ChangeAudioModal: React.FC<ChangeAudioProps> = ({
	isModalOpen,
	closeModal,
	track,
}) => {
	const [audio, setAudio] = useState<File>(null);
	const [globTrack, setGlobTrack] = useState<string>(null);
	const dispatch = useDispatch() as NextThunkDispatch;

	const updateAudioHandler = async () => {
		if (audio) {
			await dispatch(
				await updateTrack(track._id, {
					audio,
				})
			);
			closeModal(false);
			setGlobTrack(null);
			setAudio(null);
		}
	};

	return (
		<div
			className={`${
				isModalOpen
					? styles.modalOverlay + ' ' + styles.showModal
					: styles.modalOverlay
			}`}
		>
			<div className={styles.modalContainer}>
				<div className={styles.modalContent}>
					<FileUpload
						setFile={setAudio}
						setGlobTrack={setGlobTrack}
						accept='audio/*'
					>
						<div className={styles.container}>
							<h3 className={styles.heading}>Click here to add your audio</h3>

							<div className={styles.audioHolder}>
								{globTrack ? (
									<audio controls src={globTrack}>
										Your browser does not support the
										<code>audio</code> element.
									</audio>
								) : (
									<SlowMotionVideoIcon style={{ fontSize: '8rem' }} />
								)}
							</div>
						</div>
					</FileUpload>
				</div>
				<Grid
					container
					direction='row'
					justifyContent='center'
					alignItems='center'
					mb={3}
				>
					<Button
						variant='contained'
						color='primary'
						size='large'
						// className={classes.button}
						style={{ marginRight: '1rem' }}
						startIcon={<SaveIcon />}
						onClick={updateAudioHandler}
					>
						Save
					</Button>
					<Button
						variant='contained'
						color='secondary'
						size='large'
						// style={{ marginRight: "1rem" }}
						startIcon={<CancelIcon />}
						onClick={() => {
							closeModal(false);
							setGlobTrack(null);
							setAudio(null);
						}}
					>
						Cancel
					</Button>
				</Grid>

				<IconButton
					color='primary'
					aria-label='upload picture'
					component='span'
					className={styles.closeModalBtn}
					onClick={() => closeModal(false)}
				>
					<HighlightOffIcon />
				</IconButton>
			</div>
		</div>
	);
};
