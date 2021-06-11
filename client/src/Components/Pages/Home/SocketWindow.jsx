import React, { useState } from "react";
import Utils from "./Utils";
import { useConnectionContext } from "../../../state/connectionContext";
import { useGlobalContext  } from '../../../state/globalContext';

const { classes } = Utils;

function ChatWindow(props) {
  const { size, position, containerSize } = props;
  const { get, set, is } = useGlobalContext();
  const { 
    isConnected,
    getSocket,
  } = useConnectionContext();
  const socket = getSocket();


  return <div {...classes("full", "column")}>
    <button onClick={() => {socket.emit("get_connection")}}>get_connection</button>
    <button onClick={() => {socket.emit("join_room", "test")}}>join_room</button>
    <button onClick={() => {socket.emit("register_in_room", "jordan")}}>register_in_room jordan</button>
    <button onClick={() => {socket.emit("register_in_room", "bob")}}>register_in_room bob</button>
    <button onClick={() => {socket.emit("leave_room")}}>leave_room</button>

    
    
  </div>;
}

function createChatWindow(windowManager, isFocused = true) {
  // Dragable Lists window
  windowManager.createWindow({
    title: "Commands",
    key: 'socketCommands',
    isFocused,
    position: {
      left: 50,
      top: 50
    },
    size: {
      width: 200,
      height: 500
    },
    children: (props) => {
      return (
        <ChatWindow {...props}/>
      )
    },
  });
}

export default createChatWindow;
