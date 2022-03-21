import React, { useRef } from "react";

interface FileUploadProps {
  setFile: Function;
  setGlobImage?: Function;
  setGlobTrack?: Function;
  accept: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  setFile,
  setGlobImage,
  setGlobTrack,
  accept,
  children,
}) => {
  const ref = useRef<HTMLInputElement>();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files[0]);

    const readyStates = {
      EMPTY: 0,
      LOADING: 1,
      DONE: 2,
    };

    const setGlobFile = setGlobImage || setGlobTrack;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === readyStates.DONE) {
        setGlobFile(reader.result);
      }
    };
    try {
      reader.readAsDataURL(e.target.files[0]);
    } catch (e) {
      console.log("Please, choose a file");
    }
  };

  return (
    <div onClick={() => ref.current.click()}>
      <input
        ref={ref}
        accept={accept}
        type="file"
        style={{ display: "none" }}
        onChange={onChange}
      />
      {children}
    </div>
  );
};
