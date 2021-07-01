import React from "react";
import Utils from "../Utils";
import ChatIcon from '@material-ui/icons/Chat';
import Window from './Greedy';
const { classes } = Utils;

export default function (windowManager, isFocused = true) {
  // Dragable Lists window
  windowManager.createWindow({
    title: "DnD",
    key: 'DnD',
    isFocused,
    isFullSize: true,
    position: {
      left: 0,
      top: 0
    },
    size: {
      width: 400,
      height: 1000
    },
    icon: <ChatIcon />,
    children: (props) => {
      return (
        <Window {...props}/>
      )
    },
  });
}
