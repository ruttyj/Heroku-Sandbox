import React, { useState } from "react";
import Utils from "./Utils";
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


  return <div {...classes("full", "column")}>
    <button onClick={() => {socket.emit("set_connection_type", "lobby")}}>set set_connection_type "lobby"</button>
    <button onClick={() => {socket.emit("set_connection_type", "room")}}>set_connection_type "room"</button>
    <button onClick={() => {socket.emit("get_room_list")}}>get_room_list</button>
    <button onClick={() => {socket.emit("notify_room_people_all_keyed")}}>room_people_all_keyed</button>
    <button onClick={() => {socket.emit("notify_room_updated")}}>notify_room_updated</button>
    <button onClick={() => {socket.emit("get_current_room")}}>get_current_room</button>
    <button onClick={() => {socket.emit("leave_room")}}>leave_room</button>
    <button onClick={() => {socket.emit("unregister_person")}}>unregister_person</button>

    
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
