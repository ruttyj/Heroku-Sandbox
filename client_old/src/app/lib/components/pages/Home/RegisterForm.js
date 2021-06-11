
import { useState } from 'react';
import { useConnectionContext } from '../../../state/connectionContext';

export default () => {
  const initialFormState = {
    name: "jordan",
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
      if (formState.name.length > 0) {
        socket.emit("register_person", formState.name);
      } 
    }
  }
  
  return (<div>
    <form>
      <div className="form-input">
        <input type="text" name="name" value={formState.name} placeholder="Your name" onChange={handleOnChange}/>
      </div>
      <button onClick={onSubmit}>
        Register
      </button>
    </form>
  </div>)
}
