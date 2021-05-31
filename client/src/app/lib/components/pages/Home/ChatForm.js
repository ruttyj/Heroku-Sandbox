
import { useState } from 'react';
import { useConnectionContext } from '../../../state/connectionContext';

export default () => {
  const initialFormState = {
    message: "Hello World!",
  };
  const [formState, setFormState] = useState(initialFormState);

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
    <form>
      <div className="form-input">
        <input type="text" name="message" value={formState.message} placeholder="Aa" onChange={handleOnChange}/>
      </div>
      <button onClick={onSubmit}>
        Send
      </button>
    </form>
    {JSON.stringify([formState, isConnected], null, 2)}
  </div>)
}
