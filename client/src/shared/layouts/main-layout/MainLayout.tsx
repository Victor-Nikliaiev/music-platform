import { Container } from "@material-ui/core";
import React, { FC } from "react";
import { Player } from "../../../entities/player";
import Head from "next/head";
import { Navbar } from "./ui";

interface MainLayoutProps {
  title?: string;
  description?: string;
  keywords?: string;
}

export const MainLayout: FC<MainLayoutProps> = ({
  children,
  title,
  description,
  keywords,
}) => {
  return (
    <>
      <Head>
        <title>{title || "Music App"}</title>
        <meta
          name="description"
          content={`Music App | Make your word melodic. ${
            description ? description : ""
          }`}
        />
        <meta name="robots" content="index follow" />
        <meta name="keywords" content={keywords || "music, tracks, artists"} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navbar />
      <Container style={{ margin: "90px 0" }}>{children}</Container>
      <Player />
    </>
  );
};
