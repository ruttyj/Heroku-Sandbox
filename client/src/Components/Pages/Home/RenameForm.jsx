
import React, { useState, useRef } from 'react';
import { useConnectionContext } from '../../../state/connectionContext';
import { useBufferedStateContext  } from '../../../state/bufferedContext';
import FillContainer from "../../Containers/FillContainer/FillContainer";
import FillContent from "../../Containers/FillContainer/FillContent";
import FillFooter from "../../Containers/FillContainer/FillFooter";
import Utils from "../../../Utils";
import { map } from 'lodash';
const { classes } = Utils;


export default () => {
  const { set, get, remove } = useBufferedStateContext();
  const initialFormState = {
    name: get(['me', 'name'], ""),
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
        socket.emit("change_my_name", formState.name);
      } 
    }
  }

  return (
    <FillContainer>
      <FillContent
        classNames={[
          "window-content",
          
          "column",
        ]}
      >
        <form {...classes("flex", "row", "full-width")}>
          <div className="form-input chat-form full-width">
            <input type="text" name="name" {...classes("full-width", "full-height", 'flex')} value={formState.message} placeholder="Aa" onChange={handleOnChange}/>
          </div>
          <div {...classes("button")} onClick={onSubmit}>Save</div>
        </form>
      </FillContent>
      <FillFooter
        height={40}
        classNames={["footer", "actions", "center-center"]}
      >
        <div {...classes("spacer")} />
        
      </FillFooter>
    </FillContainer>
  )
}
