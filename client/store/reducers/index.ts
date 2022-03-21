import { HYDRATE } from "next-redux-wrapper";
import { combineReducers } from "redux";
import { albumReducer } from "./albumReducer";
import { playerReducer } from "./playerReducer";
import { trackReducer } from "./trackReducer";

const rootReducer = combineReducers({
  player: playerReducer,
  track: trackReducer,
  album: albumReducer,
});

export const reducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state,
      ...action.payload,
    };
    if (state.count) nextState.count = state.count;
    return nextState;
  } else {
    return rootReducer(state, action);
  }
};

export type RootState = ReturnType<typeof rootReducer>;
