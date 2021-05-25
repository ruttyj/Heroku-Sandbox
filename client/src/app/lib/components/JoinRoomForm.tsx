import React, { useState, useContext } from 'react';
import { useChatContext } from '../../state/chatContext';
import { useConnectionContext } from '../../state/connectionContext';
import SOCKET_EVENTS from '../../configs/socketEvents';

export default function JoinRoomForm() {
  
  const { 
    isConnected, clientSocket,
    roomCodeInput, setRoomCodeInput
  } = useConnectionContext();

  const { 
    messageInput, setMessageInput,
  } = useChatContext();

  const onMessageChange = (e:any) => {
    setRoomCodeInput(e.target.value)
  }
  
  const onSend = (e: any) => {
    if (isConnected && clientSocket) {
      clientSocket.emit(SOCKET_EVENTS['ROOM.JOIN'], roomCodeInput);
      setMessageInput('');
    }
    e.preventDefault()
  }

  return <>
    <textarea value={roomCodeInput} onChange={onMessageChange}/>
    <button onClick={onSend}>Send</button>
  </>;
}