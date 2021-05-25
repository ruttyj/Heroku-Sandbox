import * as React from "react";

const useConnection = (initial:any = {}) => {
  const [isConnected, setIsConnected]   = React.useState<boolean>(false);
  const [clientSocket, setClientSocket] = React.useState<any>(null);
  const [isInRoom, setIsInRoom] = React.useState<any>(false);
  const [roomCode, setRoomCode] = React.useState<any>(false);
  const [roomCodeInput, setRoomCodeInput] = React.useState<string>("");
  
  return {
    isConnected,  setIsConnected,
    clientSocket, setClientSocket,
    isInRoom, setIsInRoom,
    roomCode, setRoomCode,
    roomCodeInput, setRoomCodeInput
  }
}

const ConnectionContext = React.createContext<ReturnType<typeof useConnection> | null>(null);

// Expose the way to access the state
export const useConnectionContext = () => React.useContext(ConnectionContext)!;

// Wrap components with the provider to allow access to state
export function ConnectionStateProvider({children}: {children: React.ReactNode}) {
  return (
    <ConnectionContext.Provider value={useConnection()}>
      {children}
    </ConnectionContext.Provider>
  );
}