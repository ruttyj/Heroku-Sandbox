
import { useState } from 'react';
import { useConnectionContext } from '../../../state/connectionContext';

export default () => {
  const initialFormState = {
    room: "",
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
      if (formState.room.length > 0) {
        const socket = getSocket();
        
        // @TODO
      
      } 
    }
  }
  
  return (<div>
    <form>
      {isConnected}
      <div className="form-input">
        <input type="text" name="room" value={formState.room} placeholder="Room code" onChange={handleOnChange}/>
      </div>
      <button onClick={onSubmit}>
        Join
      </button>
    </form>
    {JSON.stringify([formState, isConnected], null, 2)}
  </div>)
}