
import { useState } from 'react';
import { useConnectionContext } from '../../../state/connectionContext';
import { useBufferedStateContext  } from '../../../state/bufferedContext';

export default () => {
  const initialFormState = {
    message: "😜",
  };
  const [formState, setFormState] = useState(initialFormState);
  const { set, get, remove } = useBufferedStateContext();

  const { 
    isConnected,
    getSocket,
  } = useConnectionContext();
  const socket = getSocket();

  const handleOnChange = (e) => {
    let value = e.target.value;
    let name = e.target.name;
    setFormState({
      ...formState,
      [name]: value
    });
  }

  const onSubmit = (e) => {
    e.preventDefault();
    if (isConnected) {
      if (formState.message.length > 0) {
        socket.emit("message", formState.message);
      } 
    }
  }
  
  return (<div>

    {get(['chat_messages']).map((message) => {

      let personName = String(get(['people', 'items', message.authorId, 'name'], 'Someone'))

      return (<div className="chat-item">
        <div className={["chat-message-author"]}>
          {personName}
        </div>
        <div className="chat-message">
          {message.message}
        </div>
      </div>)
    })}
    <form>
      <div className="form-input">
        <input type="text" name="message" value={formState.message} placeholder="Aa" onChange={handleOnChange}/>
      </div>
      <button onClick={onSubmit}>
        Send
      </button>
    </form>
  </div>)
}
