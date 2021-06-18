import React, { useState } from "react";
import Utils from "./Utils";
import { useConnectionContext } from "../../../state/connectionContext";
import { useGlobalContext  } from '../../../state/globalContext';
import DnD from './DnD';
const { classes } = Utils;


function WindowComponent({ size, position, containerSize }) {
  const { set, get, remove } = useGlobalContext();

  return (
    <>
      <DnD/>
    </>
  )
}



export default function (windowManager, isFocused = true) {
  // Debuger window
  windowManager.createWindow({
    title: "Drag & Drop",
    isFocused,
    position: {
      left: 1000,
      top: 50
    },
    size: {
      width: 400,
      height: 600
    },
    children: (props) => {
      return (
        <WindowComponent {...props}/>
      )
    }
  });
};
