import { Box, Button, Card, Grid, TextField } from '@material-ui/core';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
// import { FileUpload } from "../../components/FileUploader";
// import { StepWrapper } from "../../entities/step-wrapper";
// import { useInput } from "../../shared/hooks/useInput";
// import MainLayout from 'src/shared/layouts/main-layout/MainLayout';

import styles from 'styles/Create.module.scss';
import imageHolder from 'src/assets/imageHolder.png';
import audioHolder from 'src/assets/audioHolder.png';

// import {
// 	SelectAlbum,
// 	selectedAlbumForCreateTrack,
// } from '../../components/Album/';
import { fetchAlbums } from 'store/actions-creators/albums';
import { NextThunkDispatch, wrapper } from '../../store';
import { addTrackToAlbum } from 'store/actions-creators/track';
import { useDispatch } from 'react-redux';
import { ITrack } from 'types/track';
import { FileUpload } from 'src/shared/lib';
import { StepWrapper } from 'src/entities/step-wrapper';
import { useInput } from 'src/shared/hooks';
import { SelectAlbum } from 'src/entities/album/lib';
import { selectedAlbumForCreateTrack } from 'src/entities/album/lib/SelectAlbum';
import { MainLayout } from 'src/shared/layouts/main-layout';

const Create = () => {
	const [activeStep, setActiveStep] = useState(0);
	const [picture, setPicture] = useState(null);
	const [globImage, setGlobImage] = useState(null);
	const [globTrack, setGlobTrack] = useState(null);
	const [audio, setAudio] = useState(null);
	const name = useInput('');
	const artist = useInput('');
	const text = useInput('');
	const router = useRouter();
	const dispatch = useDispatch() as NextThunkDispatch;

	const next = async () => {
		// console.log("DOES IT WORK: ", selectedAlbumForCreateTrack);
		if (activeStep !== 2) {
			setActiveStep(prev => prev + 1);
		} else {
			const formData = new FormData();
			formData.append('name', name.value);
			formData.append('text', text.value);
			formData.append('artist', artist.value);
			formData.append('picture', picture);
			formData.append('audio', audio);
			if (selectedAlbumForCreateTrack) {
				formData.append('album', selectedAlbumForCreateTrack);
			}

			const response = await axios.post<ITrack>(
				'http://localhost:5000/tracks',
				formData
			);
			const createdTrack = response.data;

			if (selectedAlbumForCreateTrack) {
				await dispatch(
					await addTrackToAlbum(selectedAlbumForCreateTrack, createdTrack._id)
				);
			}
			router.push('/tracks');
		}
	};
	const back = () => setActiveStep(prev => prev - 1);

	return (
		<MainLayout>
			<StepWrapper
				activeStep={activeStep}
				steps={['Track Information', 'Cover Upload', 'Audio Upload']}
			>
				{activeStep === 0 && (
					<Grid container direction={'column'} style={{ padding: 20 }}>
						<TextField
							{...name}
							style={{ marginTop: 10 }}
							label={'Track name'}
						/>
						<TextField
							{...artist}
							style={{ marginTop: 10 }}
							label={'Author name'}
						/>
						<TextField
							{...text}
							style={{ marginTop: 10 }}
							multiline
							rows={3}
							label={'Lyrics'}
						/>
						<SelectAlbum />
					</Grid>
				)}
				{activeStep === 1 && (
					<FileUpload
						setFile={setPicture}
						setGlobImage={setGlobImage}
						accept='image/*'
					>
						{/*HERE BEGAN MY CODE*/}
						<div className={styles.container}>
							<h3 className={styles.heading}>Click to add your cover</h3>
							<div className={styles.imgHolder}>
								<img
									src={picture ? globImage : imageHolder}
									className={styles.img}
									alt='img'
								/>
							</div>
							{/* <div className={styles.label}>
                <label htmlFor={styles.input} className={styles.imageUpload}>
                  <AddPhotoAlternateIcon /> Choose your photo
                </label>
              </div> */}
						</div>
					</FileUpload>
				)}
				{activeStep === 2 && (
					<FileUpload
						setFile={setAudio}
						setGlobTrack={setGlobTrack}
						accept='audio/*'
					>
						<div className={styles.container}>
							<h3 className={styles.heading}>Click to add your audio</h3>

							<div className={styles.audioHolder}>
								{globTrack ? (
									<audio controls src={globTrack}>
										Your browser does not support the
										<code>audio</code> element.
									</audio>
								) : (
									<img src={audioHolder} className={styles.img} alt='img' />
								)}
							</div>
						</div>
					</FileUpload>
				)}
			</StepWrapper>
			<Grid container justifyContent='space-between'>
				<Button disabled={activeStep === 0} onClick={back}>
					Back
				</Button>
				<Button onClick={next}>Next</Button>
			</Grid>
		</MainLayout>
	);
};

export default Create;

export const getServerSideProps = wrapper.getServerSideProps(
	async ({ store }) => {
		const dispatch = store.dispatch as NextThunkDispatch;
		await dispatch(await fetchAlbums());
	}
);
