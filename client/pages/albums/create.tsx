import { Button, Grid, TextField } from '@material-ui/core';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { StepWrapper } from 'src/entities/step-wrapper';
import { useInput } from 'src/shared/hooks/useInput';
import styles from 'styles/Create.module.scss';
import imageHolder from 'src/assets/imageHolder.png';
import { FileUpload } from 'src/shared/lib';
import { MainLayout } from 'src/shared/layouts/main-layout';

const CreateAlbum = () => {
	const [activeStep, setActiveStep] = useState(0);
	const [picture, setPicture] = useState(null);
	const [globImage, setGlobImage] = useState(null);
	const name = useInput('');
	const author = useInput('');
	const router = useRouter();

	const next = () => {
		if (activeStep !== 1) {
			setActiveStep(prev => prev + 1);
		} else {
			const formData = new FormData();
			formData.append('name', name.value);
			formData.append('author', author.value);
			formData.append('picture', picture);

			axios
				.post('http://localhost:5000/albums', formData)
				.then(() => router.push('/albums'))
				.catch(e => console.log(e));
		}
	};
	const back = () => setActiveStep(prev => prev - 1);

	return (
		<MainLayout>
			<StepWrapper
				activeStep={activeStep}
				steps={['Album Information', 'Cover Upload']}
			>
				{activeStep === 0 && (
					<Grid container direction={'column'} style={{ padding: 20 }}>
						<TextField
							{...name}
							style={{ marginTop: 10 }}
							label={'Album name'}
						/>
						<TextField
							{...author}
							style={{ marginTop: 10 }}
							label={'Author name'}
						/>
					</Grid>
				)}
				{activeStep === 1 && (
					<FileUpload
						setFile={setPicture}
						setGlobImage={setGlobImage}
						accept='image/*'
					>
						<div className={styles.container}>
							<h3 className={styles.heading}>Click to add your cover</h3>
							<div className={styles.imgHolder}>
								<img
									src={picture ? globImage : imageHolder}
									className={styles.img}
									alt='img'
								/>
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

export default CreateAlbum;
