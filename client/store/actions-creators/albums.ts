import axios from "axios";
import { Dispatch } from "react";
import {
  AlbumAction,
  AlbumActionTypes,
  IAlbum,
  IAlbumUpdateData,
} from "../../types/albums";

export const fetchAlbums = () => {
  return async (dispatch: Dispatch<AlbumAction>) => {
    try {
      const response = await axios.get("http://localhost:5000/albums");
      dispatch({ type: AlbumActionTypes.FETCH_ALBUMS, payload: response.data });
    } catch (e) {
      dispatch({
        type: AlbumActionTypes.FETCH_ALBUMS_ERROR,
        payload: "We got an error loading albums",
      });
    }
  };
};

export const searchAlbums = (query: string) => {
  return async (dispatch: Dispatch<AlbumAction>) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/albums/search?query=${query}`
      );
      dispatch({ type: AlbumActionTypes.FETCH_ALBUMS, payload: response.data });
    } catch (e) {
      dispatch({
        type: AlbumActionTypes.FETCH_ALBUMS_ERROR,
        payload: "We got an error searching tracks.",
      });
    }
  };
};

export const removeAlbum = (id: string) => {
  return async (dispatch: Dispatch<AlbumAction>) => {
    try {
      const response = await axios.delete(`http://localhost:5000/albums/${id}`);
      dispatch({ type: AlbumActionTypes.REMOVE_ALBUM, payload: response.data });
    } catch (e) {
      dispatch({
        type: AlbumActionTypes.REMOVE_ALBUM_ERROR,
        payload: e.message,
      });
    }
  };
};

export const setActiveAlbum = (payload: IAlbum): AlbumAction => {
  return { type: AlbumActionTypes.SET_ACTIVE_ALBUM, payload };
};

export const setResponseError = (payload: string): AlbumAction => {
  return { type: AlbumActionTypes.SET_RESPONSE_ERROR, payload };
};

export const setResponseMessage = (payload: string): AlbumAction => {
  return { type: AlbumActionTypes.SET_RESPONSE_MESSAGE, payload };
};

export const updateAlbum = (albumId: string, data: IAlbumUpdateData) => {
  const formattedData = new FormData();
  for (let key in data) {
    formattedData.append(key, data[key]);
  }

  return async (dispatch: Dispatch<AlbumAction>) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/albums/update/${albumId}`,
        formattedData
      );
      dispatch({
        type: AlbumActionTypes.UPDATE_ALBUM,
        payload: response.data,
      });
    } catch (e) {
      dispatch({
        type: AlbumActionTypes.UPDATE_ALBUM_ERROR,
        payload: `We got an error updating this album: ${e.message}`,
      });
    }
  };
};
