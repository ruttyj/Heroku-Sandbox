import { useState, useEffect } from 'react';
import { useConnectionContext } from '../../../state/connectionContext';
import JoinRoomForm from './JoinRoomForm';

export default () => {
  const [isMounted, setMounted] = useState(false);
 
  // Socket Connection to serverside
  const { 
    isConnected,
    getSocket,
    connectionState, setConnectionState
  } = useConnectionContext();
  const socket = getSocket();

  // Component state
  const initialState = {
    connection_type: null,
    room_list: [],
  }
  const [compState, setCompState] = useState(initialState);

  const [timeState, setTimeState] = useState("");


  useEffect(() => {
    if (!isMounted) {
      console.log('Home component mounted');
      
      setMounted(true);
    }
  }, [isMounted]);


  // Set listeners
  useEffect(() => {
    if (isConnected) {
      
      socket.on('time', (timeString) => {
        setTimeState(timeString);
      });

      socket.on('connection_type', (data) => {
        setConnectionState({
          ...connectionState,
          connection_type: data,
        })
      })


      socket.on('room_list', (payload) => {
        console.log('room_list', payload);
        setConnectionState({
          ...connectionState,
          room_list: payload.data,
        })
      })



      socket.emit('get_room_list');
      
      
    } else if (socket) {
      socket.off('time');
    }
  }, [isConnected])

  let bodyContent = "";
  switch(connectionState.connection_type){
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
        Default body
      </div>)
      break;
    
    default:
      bodyContent = (<div>
        Fallback body
      </div>)
  }

  return (<div>
    <h1>Hello World!</h1>
    {JSON.stringify(timeState)}
    <JoinRoomForm/>
    <h3>Connection Type:</h3>
    <button onClick={() => {socket.emit("get_connection_type")}}>get connection type</button>
    <pre>{JSON.stringify(connectionState.connection_type, null, 2)}</pre>
    <br/>
    <button onClick={() => {socket.emit("set_connection_type", "lobby")}}>set type "lobby"</button>
    <button onClick={() => {socket.emit("set_connection_type", "room")}}>set type "room"</button>
    {bodyContent}
    <hr/>
    <h3>Connection State:</h3>
    <button onClick={() => {socket.emit("get_room_list")}}>get room list</button>
    <pre>{JSON.stringify(connectionState, null, 2)}</pre>
  </div>);
}
