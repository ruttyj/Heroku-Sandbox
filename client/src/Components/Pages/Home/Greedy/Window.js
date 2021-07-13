import React from "react";
import Utils from "../Utils";
import ChatIcon from '@material-ui/icons/Chat';
import Window from './Component';
const { classes } = Utils;

export default function (windowManager, isFocused = true) {
  const custom = {
    title: "DnD",
    key: 'DnD',
    icon: <ChatIcon />,
    isFullSize: false,
  }

  // Dragable Lists window
  windowManager.createWindow({
    ...custom,
    isFocused,
    position: {
      left: 400,
      top: 0
    },
    size: {
      width: 1000,
      height: 1000
    },
    children: (props) => {
      return (
        <Window {...props}/>
      )
    },
  });
}
