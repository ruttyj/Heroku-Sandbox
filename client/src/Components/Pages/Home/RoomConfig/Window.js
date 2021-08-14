import React from "react";
import Utils from "../Utils";
import WindowComponent from './Component';
const { classes } = Utils;

export default function (windowManager, isFocused = true) {
  // Dragable Lists window
  windowManager.createWindow({
    title: "Config",
    key: 'RoomConfig',
    isFocused,
    position: {
      left: 0,
      top: 0
    },
    size: {
      width: 500,
      height: 700
    },
    isFullSize: false,
    children: (props) => {
      return (
        <WindowComponent {...props}/>
      )
    },
  });
}
