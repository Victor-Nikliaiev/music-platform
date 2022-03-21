import * as PlayerActionCreators from "../actions-creators/player";
import {
  setActiveAlbum,
  setResponseError,
  setResponseMessage,
} from "../actions-creators/albums";

export const ActionCreators = {
  ...PlayerActionCreators,
  setActiveAlbum,
  setResponseError,
  setResponseMessage,
};
