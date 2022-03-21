import { useActions, useTypedSelector } from 'src/shared/hooks';
import React from 'react';
import { useDispatch } from 'react-redux';
import { NextThunkDispatch } from 'store';
import { fetchAlbums, removeAlbum } from 'store/actions-creators/albums';
import { IAlbum } from 'types/albums';

export const useDeleteAlbum = (album: IAlbum) => {
	const { setActiveAlbum } = useActions();
	const dispatch = useDispatch() as NextThunkDispatch;
	const { removeResponse } = useTypedSelector(state => state.album);

	const deleteAlbum = async e => {
		e.stopPropagation();
		setActiveAlbum(album);
		await dispatch(await removeAlbum(album._id));
		if (removeResponse?.error) {
			return;
		}
		await dispatch(await fetchAlbums());
	};

	return { deleteAlbum };
};
