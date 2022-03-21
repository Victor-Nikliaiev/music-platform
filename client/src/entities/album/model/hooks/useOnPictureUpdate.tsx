import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { NextThunkDispatch } from "store";
import { updateAlbum } from "store/actions-creators/albums";

export const useOnPictureUpdate = (thisAlbum) => {
  const [picture, setPicture] = useState<File>(null);
  const [globTrackPicture, setGlobTrackPicture] = useState(null);
  const dispatch = useDispatch() as NextThunkDispatch;

  const handlePictureUpdate = async (picture) => {
    await dispatch(
      await updateAlbum(thisAlbum._id, {
        picture,
      })
    );
  };

  useEffect(() => {
    if (picture) {
      handlePictureUpdate(picture);
    }
  }, [picture]);

  return { setPicture, globTrackPicture, setGlobTrackPicture };
};
