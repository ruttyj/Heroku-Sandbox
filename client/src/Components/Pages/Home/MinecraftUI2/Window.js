import React from "react";
import Utils from "../Utils";
import WindowComponent from './Component';
const { classes } = Utils;

export default function (windowManager, isFocused = true) {
  // Dragable Lists window
  windowManager.createWindow({
    title: "Minecraft UI",
    isFocused,
    position: {
      left: 700,
      top: 50
    },
    size: {
      width: 500,
      height: 700
    },
    isFullSize: false,
    children: (props) => {
      return (
        <WindowComponent {...props} />
      )
    },
  });
}
