import * as React from "react";
import { useState, useRef, useEffect } from 'react';
import * as io from 'socket.io-client';

const useConnection = (initial = {}) => {
  const [isConnected, setIsConnected]   = useState(false);
  const clientSocket = useRef(null);
  const [roomCode, setRoomCode] = useState(null);
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [isMounted, setMounted] = useState(false);

  const onMount = () => {
    console.log("mounted");
    clientSocket.current = io.connect();
    setIsConnected(true);
  }

  useEffect(() => {
    if (!isMounted) {
      onMount();
      setMounted(true);
    }
  }, [isMounted]);


  function getSocket() {
    return clientSocket.current;
  }

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