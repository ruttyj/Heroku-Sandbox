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

function ChatWindow(props) {
  const { size, position, containerSize } = props;
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

  if (!isRegistered){
    displayMode = 'register';
  } else {
    if (!inRoom) {
      displayMode = 'pickRoom';
    } else {
      displayMode = 'chat';
    }
  }

  switch(displayMode) {
    case 'pickRoom':
      content = <JoinRoomForm/>
    break;
    case 'chat':
      content = <ChatForm/>
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
    title: "Window A",
    key: 'chat',
    isFocused,
    position: {
      left: 300,
      top: 50
    },
    size: {
      width: 700,
      height: 700
    },
    children: (props) => {
      return (
        <ChatWindow {...props}/>
      )
    },
  });
}

export default createChatWindow;
