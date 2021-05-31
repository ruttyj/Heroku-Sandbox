import { useState, useEffect } from 'react';
import { useConnectionContext } from '../../../state/connectionContext';
import { useBufferedStateContext  } from '../../../state/bufferedContext';
import JoinRoomForm from './JoinRoomForm';
import RegisterForm from './RegisterForm';
import ChatForm from './ChatForm';

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
        connection: null,
        me: null,
        room: null,
        connection_type: null,
        room_list: [],
        chat_messages: [],
        room_people_all_keyed: {},
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

      socket.on('message', (messageModel) => {
        console.log('message', messageModel);
        let chatMessages = get(['chat_messages'], []);
        chatMessages = [...chatMessages, messageModel];
        set(['chat_messages'], chatMessages);
      });

      socket.on('connection', (data) => {
        set(['connection'], data);
      })


      socket.on('leave_room', (data) => {
        console.log('left room');
      })
      

      socket.on('room', (data) => {
        set(['room'], data);
      })

      socket.on('connection_type', (data) => {
        set(['connection_type'], data);
      })

      socket.on('me', (data) => {
        set(['me'], data);
      })

      socket.on('room_list', (payload) => {
        set(['room_list'], payload.data);
      })


      socket.on('room_people_all_keyed', (payload) => {
        console.log('room_people_all_keyed', payload);
        set(['people'], payload);
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
        <ChatForm/>
      </div>)
      break;
    
    case "lobby":
      let lobbyContent = "";

      if (!get(['connection', 'personId'])) {
        lobbyContent = <RegisterForm/>;
      } else if(!get(['connection', 'roomId'])) {
        lobbyContent = <JoinRoomForm/>;
      }
      
      bodyContent = (<div>
        {lobbyContent}
      </div>)
      break;
    
    case "default":
      bodyContent = (<div>
        Default
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
      
      <h3>Connection Type:</h3>
      <pre>{JSON.stringify(get(['connection_type']), null, 2)}</pre>
      <button onClick={() => {socket.emit("get_connection_type")}}>get connection type</button>

      <br/>
      <button onClick={() => {socket.emit("set_connection_type", "lobby")}}>set set_connection_type "lobby"</button>
      <button onClick={() => {socket.emit("set_connection_type", "room")}}>set_connection_type "room"</button>
      <button onClick={() => {socket.emit("get_room_list")}}>get_room_list</button>
      <button onClick={() => {socket.emit("leave_room")}}>leave_room</button>
      <button onClick={() => {socket.emit("get_room_people_all_keyed")}}>room_people_all_keyed</button>
      <button onClick={() => {socket.emit("notify_room_updated")}}>notify_room_updated</button>

      
      {bodyContent}
      <hr/>
      <h3>State:</h3>
      <pre>{JSON.stringify(get(), null, 2)}</pre>
      
    </div>
  );
}
