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

  // Set listeners
  useEffect(() => {
    const socket = getSocket();
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
    
  </div>);
}