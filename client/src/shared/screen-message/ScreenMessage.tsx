import React, { useEffect } from "react";
import cx from "classnames";

import { useActions, useTypedSelector } from "../hooks";
import styles from "./ScreenMessage.module.scss";

interface ScreenMessagesProps {
  type: string;
  message: string;
}

export const ScreenMessage: React.FC<ScreenMessagesProps> = ({
  type,
  message,
}) => {
  const { removeResponse } = useTypedSelector((state) => state.album);
  const { setResponseMessage, setResponseError } = useActions();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (removeResponse?.error) {
        setResponseError("");
      }
      if (removeResponse?.message) {
        setResponseMessage("");
      }
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <p
      className={cx(
        styles.message,
        type === "ERROR" ? styles.message__error : styles.message__success
      )}
    >
      {message}
    </p>
  );
};
