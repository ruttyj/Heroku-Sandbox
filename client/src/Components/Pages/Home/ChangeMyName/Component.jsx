
import React, { useState, useRef, useEffect } from 'react';
import { useConnectionContext } from '../../../../state/connectionContext';
import { useGlobalContext } from '../../../../state/globalContext';
import FillContainer from "../../../Containers/FillContainer/FillContainer";
import FillContent from "../../../Containers/FillContainer/FillContent";
import FillFooter from "../../../Containers/FillContainer/FillFooter";
import Utils from "../../../../Utils";
import TextField from '@material-ui/core/TextField';
import useDataHelper from '../../../../state/StateHelper/roomHelper';

const { classes } = Utils;

export default ({ window }) => {
  const { windowManager } = useGlobalContext();
  const { isConnected } = useConnectionContext();

  const {
    getMyName,
    changeMyName,
  } = useDataHelper();

  const initialFormState = {
    name: getMyName(),
  };
  const [formState, setFormState] = useState(initialFormState);
  const onSubmit = (e) => {
    e.preventDefault();
    if (formState.name.length > 0) {
      if (isConnected) {
        changeMyName(formState.name);
        windowManager.removeWindow(window.id)
      }
    }
    return false;
  }

  const handleOnChange = (e) => {
    let value = e.target.value;
    let name = e.target.name;
    setFormState({
      ...formState,
      [name]: value
    });
  }

  let keyPress = (e) => {
    if (e.keyCode == 13) {
      onSubmit(e);
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
            autoComplete="off"
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
