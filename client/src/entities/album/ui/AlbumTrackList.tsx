import React, { useEffect, useState } from "react";
import { IAlbum } from "../../../types/albums";
import { Grid } from "@material-ui/core";
import { TrackList } from "../../Track";
import { ItemForAlbum } from "../ItemForAlbum";

interface AlbumTrackListProps {
  thisAlbum: IAlbum;
}
export const AlbumTrackList: React.FC<AlbumTrackListProps> = ({
  thisAlbum,
}) => {
  return (
    <Grid container direction="column">
      <TrackList tracks={thisAlbum.tracks} Component={ItemForAlbum} />
    </Grid>
  );
};
