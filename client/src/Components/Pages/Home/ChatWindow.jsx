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
import { useBufferedStateContext  } from '../../../state/bufferedContext';

const { classes } = Utils;

function Window(props) {
  const { get, set, is } = useBufferedStateContext();
  const { 
    isConnected,
    getSocket,
  } = useConnectionContext();
  const socket = getSocket();

  let content = '';
  let displayMode = 'register';


  let isRegistered = get(['me'], false);
  let inRoom = get(['room'], false);

  if (!inRoom) {
    displayMode = 'pickRoom';
  } else if (!isRegistered) {
    displayMode = 'register';
  } else {
    displayMode = 'chat';
  }

  switch(displayMode) {
    case 'pickRoom':
      content = <JoinRoomForm/>
    break;
    case 'chat':
      content = <ChatForm {...props}/>
    break;
    case 'register':
    default:
      content = <RegisterForm/>
    break;
  }


  return (content);
}

function createChatWindow(windowManager, isFocused = true) {
  // Dragable Lists window
  windowManager.createWindow({
    title: "Chat",
    key: 'chat',
    isFocused,
    position: {
      left: 300,
      top: 50
    },
    size: {
      width: 400,
      height: 500
    },
    children: (props) => {
      return (
        <Window {...props}/>
      )
    },
  });
}

export default createChatWindow;
