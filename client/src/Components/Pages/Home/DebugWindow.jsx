import React, { useState } from "react";
import Utils from "./Utils";
import wallpapers from "../../../Data/Wallpapers";
import FillContainer from "../../Containers/FillContainer/FillContainer";
import FillContent from "../../Containers/FillContainer/FillContent";
import FillFooter from "../../Containers/FillContainer/FillFooter";
import FillHeader from "../../Containers/FillContainer/FillHeader";
import RegisterForm from "./RegisterForm";
import JoinRoomForm from "./JoinRoomForm";
import ChatForm from "./ChatForm";
import { useConnectionContext } from "../../../state/connectionContext";
import { useGlobalContext  } from '../../../state/globalContext';
const { classes } = Utils;


function DebugComponent({ size, position, containerSize }) {
  const { set, get, remove } = useGlobalContext();


  const raw = get([]);
  const result = [];

  Object.keys(raw).forEach((key) => {
    let value = raw[key];
    result.push(<xmp>
      {key}:
      {JSON.stringify(value, null, 2)}
    </xmp>);
  })


  return (
    <pre {...classes("column", "align-left", "full-width")}>
      {result}
    </pre>
  )
}

function createDebugger(windowManager, isFocused = true) {
  // Debuger window
  windowManager.createWindow({
    key: "debugger",
    title: "Debuger",
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
        <DebugComponent {...props}/>
      )
    }
  });
}

export default createDebugger;
