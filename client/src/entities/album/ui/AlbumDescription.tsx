import React, { useRef } from "react";
import styles from "@app/styles/AlbumPage.module.scss";
import { IAlbum } from "../../../types/albums";
import EditIcon from "@material-ui/icons/Edit";
import { useOnBlurUpdate } from "../model/hooks";

interface AlbumDescriptionProps {
  thisAlbum: IAlbum;
  setThisAlbum: Function;
}
export const AlbumDescription: React.FC<AlbumDescriptionProps> = ({
  thisAlbum,
  setThisAlbum,
}) => {
  const nameRef = useRef<HTMLSpanElement>(null);
  const artistRef = useRef<HTMLSpanElement>(null);
  const { isEditable, handleClickOnEditIcon, handleOnBlurAlbumUpdate } =
    useOnBlurUpdate(thisAlbum, setThisAlbum);

  return (
    <div style={{ margin: 30 }}>
      <h2>
        Name:{" "}
        <span
          className={`${styles.spanField}${
            isEditable ? " " + styles.isEditable : ""
          }`}
          ref={nameRef}
          onBlur={() => handleOnBlurAlbumUpdate(nameRef, "name")}
          contentEditable={isEditable}
        >
          {thisAlbum.name}
        </span>{" "}
        <EditIcon
          onClick={() => handleClickOnEditIcon(nameRef)}
          className={styles.editIcon}
        />
      </h2>
      <h2>
        Artist:{" "}
        <span
          ref={artistRef}
          contentEditable={isEditable}
          onBlur={() => handleOnBlurAlbumUpdate(artistRef, "author")}
          className={`${styles.spanField}${
            isEditable ? " " + styles.isEditable : ""
          }`}
        >
          {thisAlbum.author}
        </span>{" "}
        <EditIcon
          onClick={() => handleClickOnEditIcon(artistRef)}
          className={styles.editIcon}
        />
      </h2>
      <h2>Tracks: {thisAlbum.tracks.length}</h2>
    </div>
  );
};
