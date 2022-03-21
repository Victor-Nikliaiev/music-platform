import axios from "axios";
import { Dispatch } from "react";
import {
  ITrack,
  ITrackUpdateData,
  TrackAction,
  TrackActionTypes,
} from "../../types/track";

export const fetchTracks = (count: number = 10) => {
  return async (dispatch: Dispatch<TrackAction>) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/tracks?count=${count}`
      );
      dispatch({ type: TrackActionTypes.FETCH_TRACKS, payload: response.data });
    } catch (e) {
      console.log(e);
      dispatch({
        type: TrackActionTypes.FETCH_TRACKS_ERROR,
        payload: "We got an error loading tracks.",
      });
    }
  };
};

export const searchTracks = (query: string) => {
  return async (dispatch: Dispatch<TrackAction>) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/tracks/search?query=${query}`
      );
      dispatch({ type: TrackActionTypes.FETCH_TRACKS, payload: response.data });
    } catch (e) {
      dispatch({
        type: TrackActionTypes.FETCH_TRACKS_ERROR,
        payload: "We got an error searching tracks.",
      });
    }
  };
};

export const removeTrack = (id: string) => {
  return async (dispatch: Dispatch<TrackAction>) => {
    try {
      const response = await axios.delete(`http://localhost:5000/tracks/${id}`);
      dispatch({ type: TrackActionTypes.REMOVE_TRACK, payload: response.data });
    } catch (e) {
      dispatch({
        type: TrackActionTypes.REMOVE_TRACK_ERROR,
        payload: "We got an error removing track.",
      });
    }
  };
};

export const removeTrackFromAlbum = (albumId: string, trackId: string) => {
  return async (dispatch: Dispatch<TrackAction>) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/tracks/remove_from_album`,
        {
          albumId,
          trackId,
        }
      );
      dispatch({
        type: TrackActionTypes.REMOVE_TRACK_FROM_ALBUM,
        payload: response.data,
      });
    } catch (e) {
      dispatch({
        type: TrackActionTypes.REMOVE_TRACK_ERROR,
        payload: "We got an error removing track.",
      });
    }
  };
};

export const addTrackToAlbum = (albumId: string, trackId: string) => {
  return async (dispatch: Dispatch<TrackAction>) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/tracks/add_to_album`,
        {
          albumId,
          trackId,
        }
      );
      dispatch({
        type: TrackActionTypes.ADD_TRACK_TO_ALBUM,
        payload: response.data,
      });
    } catch (e) {
      dispatch({
        type: TrackActionTypes.ADD_TRACK_TO_ALBUM_ERROR,
        payload: "We got an error adding this track into the album.",
      });
    }
  };
};

export const updateTrack = (trackId: string, data: ITrackUpdateData) => {
  const formattedData = new FormData();
  for (let key in data) {
    formattedData.append(key, data[key]);
  }
  return async (dispatch: Dispatch<TrackAction>) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/tracks/update/${trackId}`,
        formattedData
      );
      dispatch({
        type: TrackActionTypes.UPDATE_TRACK,
        payload: response.data,
      });
    } catch (e) {
      dispatch({
        type: TrackActionTypes.UPDATE_TRACK_ERROR,
        payload: `We got an error updating this track: ${e.message}`,
      });
    }
  };
};
