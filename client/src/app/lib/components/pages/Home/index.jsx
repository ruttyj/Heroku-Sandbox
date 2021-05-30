import { useState, useEffect } from 'react';
import { useConnectionContext } from '../../../state/connectionContext';
import { useBufferedStateContext  } from '../../../state/bufferedContext';
import JoinRoomForm from './JoinRoomForm';
import RegisterForm from './RegisterForm';

export default () => {
  const [isMounted, setMounted] = useState(false);
  const { set, get, remove } = useBufferedStateContext();

  // Socket Connection to serverside
  const { 
    isConnected,
    getSocket,
  } = useConnectionContext();
  const socket = getSocket();


  useEffect(() => {
    if (!isMounted) {
      console.log('Home component mounted');
      const initialState = {
        me: null,
        connection_type: null,
        room_list: [],
      }
      set([], initialState);
      setMounted(true);
    }
  }, [isMounted]);


  // Set listeners
  useEffect(() => {
    if (isConnected) {
      
      socket.on('time', (timeString) => {
        set(['time'], timeString);
      });

      socket.on('connection_type', (data) => {
        set(['connection_type'], data);
      })

      socket.on('me', (data) => {
        set(['me'], data);
      })

      socket.on('room_list', (payload) => {
        set(['room_list'], payload.data);
      })

      socket.emit("get_connection_type");
      socket.emit('get_room_list');
      
    } else if (socket) {
      socket.off('time');
    }
  }, [isConnected])

  let bodyContent = "";
  switch(get(['connection_type'])){
    case "room":
      bodyContent = (<div>
        Room body
      </div>)
      break;
    
    case "lobby":
      bodyContent = (<div>
        Lobby body
      </div>)
      break;
    
    case "default":
      bodyContent = (<div>
        <RegisterForm/>
      </div>)
      break;
    
    default:
      bodyContent = (<div>
        Fallback body
      </div>)
  }

  return (
    <div>
      <h1>Hello World!</h1>
      <JoinRoomForm/>
      <h3>Connection Type:</h3>
      <button onClick={() => {socket.emit("get_connection_type")}}>get connection type</button>
      <pre>{JSON.stringify(get(['connection_type']), null, 2)}</pre>
      <br/>
      <button onClick={() => {socket.emit("set_connection_type", "lobby")}}>set type "lobby"</button>
      <button onClick={() => {socket.emit("set_connection_type", "room")}}>set type "room"</button>
      <button onClick={() => {socket.emit("get_room_list")}}>get room list</button>
      {bodyContent}
      <hr/>
      <h3>State:</h3>
      <pre>{JSON.stringify(get(), null, 2)}</pre>
      
    </div>
  );
}
