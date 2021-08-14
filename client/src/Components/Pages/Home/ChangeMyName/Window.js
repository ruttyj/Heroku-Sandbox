import React from "react";
import WindowComponent from './Component';

export default function (windowManager, isFocused = true) {
  windowManager.createWindow({
    title: "Change My Name",
    key: 'ChangeMyName',
    isFocused,
    position: {
      left: 1500,
      top: 0
    },
    size: {
      width: 400,
      height: 150
    },
    isFullSize: false,
    children: (props) => {
      return (
        <WindowComponent {...props} />
      )
    },
  });
}
