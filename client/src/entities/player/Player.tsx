import { Grid, IconButton } from "@material-ui/core";
import { Pause, PlayArrow, VolumeUp } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useActions } from "../../shared/hooks/useActions";
import { useTypedSelector } from "../../shared/hooks/useTypedSelector";
import { setActiveTrack } from "../../store/actions-creators/player";
import styles from "./Player.module.scss";
import { ITrack } from "../../types/track";
import { TrackProgress } from "./TrackProgress";

let audio;

export const getAudio = () => {
  return audio;
};
export const Player = () => {
  const { pause, volume, active, duration, currentTime } = useTypedSelector(
    (state) => state.player
  );
  const { pauseTrack, playTrack, setVolume, setCurrentTime, setDuration } =
    useActions();

  useEffect(() => {
    if (!active && pause) {
      setCurrentTime(0);
      audio?.pause();
    }
    if (!audio) {
      audio = new Audio();
    }
    if (!active) return;
    setAudio();
    audio.play();
  }, [active]);

  useEffect(() => {
    if (!active) return;
    playTrack();
  }, [audio?.src]);

  useEffect(() => {
    if (currentTime === duration) {
      pauseTrack();
      setCurrentTime(0);
    }
  }, [currentTime]);

  const setAudio = (isPathClear = true) => {
    if (active) {
      if (!isPathClear) {
        audio.src = "";
      }
      audio.src = "http://localhost:5000/" + active.audio;
      audio.volume = volume / 100;
      audio.onloadedmetadata = () => {
        setDuration(Math.ceil(audio.duration));
      };
      audio.ontimeupdate = () => {
        setCurrentTime(Math.ceil(audio.currentTime));
      };
    }
  };

  const playPause = () => {
    if (pause) {
      playTrack();
      audio.play();
      return;
    }

    pauseTrack();
    audio.pause();
  };

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    audio.volume = Number(e.target.value) / 100;
    setVolume(Number(e.target.value));
  };

  const changeCurrentTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    audio.currentTime = Number(e.target.value);
    setCurrentTime(Number(e.target.value));
  };

  if (!active) {
    return null;
  }

  return (
    <div className={styles.player}>
      <IconButton onClick={playPause}>
        {!pause ? <Pause /> : <PlayArrow />}
      </IconButton>
      <Grid
        container
        direction="column"
        style={{ width: 200, margin: "0 20px" }}
      >
        <div>{active?.name}</div>
        <div style={{ fontSize: 12, color: "gray" }}> {active?.artist}</div>
      </Grid>
      <TrackProgress
        left={currentTime}
        right={duration}
        onChange={changeCurrentTime}
        type="TRACK"
      />
      <VolumeUp style={{ marginLeft: "auto" }}></VolumeUp>
      <TrackProgress
        left={volume}
        right={100}
        onChange={changeVolume}
        type="VOLUME"
      />
    </div>
  );
};
