
import React, { useState, useRef, useEffect } from 'react';
import { useConnectionContext } from '../../../../state/connectionContext';
import { useGlobalContext } from '../../../../state/globalContext';
import FillContainer from "../../../Containers/FillContainer/FillContainer";
import FillContent from "../../../Containers/FillContainer/FillContent";
import FillFooter from "../../../Containers/FillContainer/FillFooter";
import Utils from "../../../../Utils";
import TextField from '@material-ui/core/TextField';

const { classes } = Utils;


export default ({ window }) => {
  const { set, get, remove, windowManager } = useGlobalContext();
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
        windowManager.removeWindow(window.id)
      }
    }
    return false;
  }


  let keyPress = (e) => {
    if (e.keyCode == 13) {
      console.log('value', e);
      onSubmit(e);
      // put the login here
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
        <div className="form-input chat-form full-width">
          <TextField
            inputRef={input => input && input.focus()}
            autoFocus
            name="name"
            label="Name"
            variant="filled"
            {...classes("full-width", "full-height", 'flex')}
            value={formState.message}
            placeholder="Aa"
            onChange={handleOnChange}
            onKeyDown={(e) => keyPress(e)}
          />
        </div>
      </FillContent>
      <FillFooter
        height={40}
        classNames={["footer", "actions", "center-center"]}
      >
        <div {...classes("spacer")} />
        <div {...classes("button")} onClick={onSubmit}>Save</div>
      </FillFooter>
    </FillContainer>
  )
}
