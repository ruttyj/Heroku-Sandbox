import * as React from "react";
import { useState, useRef, useEffect } from 'react';
import * as io from 'socket.io-client';

const useConnection = (initial = {}) => {
  const [isConnected, setIsConnected]   = useState(false);
  const clientSocket = useRef(null);
  const [roomCode, setRoomCode] = useState(null);
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [isMounted, setMounted] = useState(false);

  function getSocket() {
    return clientSocket.current;
  }

  function onMount () {
    console.log("mounted");

    // Connect to socket
    const socket = io.connect();
    clientSocket.current = socket;
    setIsConnected(true);
  }

  function addListeners() {
    const socket = getSocket();

    socket.on("connection_type", (data) => {
      console.log("connection_type", data);
    })
  }

  

  useEffect(() => {
    if (!isMounted) {
      onMount();
      addListeners();
      setMounted(true);
    }
  }, [isMounted]);

  return {
    isConnected,
    getSocket,
    roomCode, setRoomCode,
    roomCodeInput, setRoomCodeInput
  }
}

const ConnectionContext = React.createContext(null);

// Expose the way to access the state
export const useConnectionContext = () => React.useContext(ConnectionContext);

// Wrap components with the provider to allow access to state
export function ConnectionStateProvider({children}) {
  return (
    <ConnectionContext.Provider value={useConnection()}>
      {children}
    </ConnectionContext.Provider>
  );
}