
import React, { useState } from 'react';
import { useConnectionContext } from '../../../state/connectionContext';

export default () => {
  const initialFormState = {
    code: "test",
  };
  const [formState, setFormState] = useState(initialFormState);

  const { 
    isConnected,
    getSocket,
  } = useConnectionContext();

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
      if (formState.code.length > 0) {
        const socket = getSocket();
        
        // @TODO
        socket.emit("join_room", formState.code)
      } 
    }
  }
  
  return (<div>
    <form>
      {isConnected}
      <div className="form-input">
        <input type="text" name="code" value={formState.code} placeholder="Room code" onChange={handleOnChange}/>
      </div>
      <button onClick={onSubmit}>
        Join
      </button>
    </form>
  </div>)
}
