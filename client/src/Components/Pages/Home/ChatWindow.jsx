import React from "react";
import Utils from "./Utils";
import RegisterForm from "./RegisterForm";
import JoinRoomForm from "./JoinRoomForm";
import ChatForm from "./ChatForm";
import ChatIcon from '@material-ui/icons/Chat';
import { useGlobalContext  } from '../../../state/globalContext';

const { classes } = Utils;

function Window(props) {
  const { get, set, is } = useGlobalContext();

  let content = '';
  let displayMode = 'register';

  
  let isRegistered = get(['connection',  'personId'], false);
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

export default function (windowManager, isFocused = true) {
  // Dragable Lists window
  windowManager.createWindow({
    title: "Chat",
    key: 'chat',
    isFocused,
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
