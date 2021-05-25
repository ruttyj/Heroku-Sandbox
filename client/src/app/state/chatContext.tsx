import * as React from "react";

const useChat = (initial:any = {}) => {
  const [messageInput, setMessageInput] = React.useState<string>("");
  const [messageList, setMessageList]   = React.useState<string[]>([]);

  return {
    messageInput, setMessageInput,
    messageList,  setMessageList,
  }
}

const ChatContext = React.createContext<ReturnType<typeof useChat> | null>(null);

// Expose the way to access the state
export const useChatContext = () => React.useContext(ChatContext)!;

// Wrap components with the provider to allow access to state
export function ChatStateProvider({children}: {children: React.ReactNode}) {
  return (
    <ChatContext.Provider value={useChat()}>
      {children}
    </ChatContext.Provider>
  );
}