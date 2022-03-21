import { Button } from "@material-ui/core";
import { useRouter } from "next/router";
import React from "react";

interface AlbumHeaderProps {}
export const AlbumHeader: React.FC<AlbumHeaderProps> = ({}) => {
  const router = useRouter();
  return (
    <Button
      variant={"outlined"}
      style={{ fontSize: 32 }}
      onClick={() => router.push("/albums")}
    >
      Back to thisAlbum list
    </Button>
  );
};
