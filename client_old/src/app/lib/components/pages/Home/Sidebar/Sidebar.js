
import { useState } from 'react';
import { useConnectionContext } from '../../../../state/connectionContext';
import { useBufferedStateContext  } from '../../../../state/bufferedContext';




//<ChatIcon/>
import './sidebarStyle.css';
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
  
  return (
    <div className="sidebar-container">
      <div className="sidebar-item" onClick={() => {
        set(['mode'], get(['mode'], 'chat') == 'default' ? 'chat' : 'default')
      }}>
        
      </div>
      <div className="sidebar-item">
        {get(['mode'], 'default')}
      </div>
    </div>
  )
}
