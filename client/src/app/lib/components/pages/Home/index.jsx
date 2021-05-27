import { useState, useEffect } from 'react';
import { useConnectionContext } from '../../../state/connectionContext';
import JoinRoomForm from './JoinRoomForm';

export default () => {
  const initialFormState = {
    title: "",
  };
  const [timeState, setTimeState] = useState("");
  const { 
    isConnected,
    getSocket,
  } = useConnectionContext();
  const socket = getSocket();

  // Set listeners
  useEffect(() => {
    if (isConnected) {
      socket.on('time', (timeString) => {
        setTimeState(timeString);
      });
    } else if (socket) {
      socket.off('time');
    }
  }, [isConnected])

  return (<div>
    <h1>Hello World!</h1>
    {JSON.stringify(timeState)}
    <JoinRoomForm/>
    <button onClick={() => {socket.emit("connection_type")}}>get connection type</button>
    <button onClick={() => {socket.emit("set_connection_type", "lobby")}}>set type "lobby"</button>
    <button onClick={() => {socket.emit("set_connection_type", "room")}}>set type "room"</button>
  </div>);
}