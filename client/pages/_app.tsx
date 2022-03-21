import React, { FC } from "react";
import { AppProps } from "next/app";
import { NextThunkDispatch, wrapper } from "../store";
import { fetchAlbums } from "../store/actions-creators/albums";
import axios from "axios";

const WrappedApp: FC<AppProps> = ({ Component, pageProps }) => (
  <Component {...pageProps} />
);

export default wrapper.withRedux(WrappedApp);
