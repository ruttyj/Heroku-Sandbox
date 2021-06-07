
import React, { useState, useRef } from 'react';
import { useConnectionContext } from '../../../state/connectionContext';
import { useBufferedStateContext  } from '../../../state/bufferedContext';
import FillContainer from "../../Containers/FillContainer/FillContainer";
import FillContent from "../../Containers/FillContainer/FillContent";
import FillFooter from "../../Containers/FillContainer/FillFooter";
import SendIcon from '@material-ui/icons/Send';
import Utils from "../../../Utils";
import { map } from 'lodash';
const { classes } = Utils;


function RenderCounter()
{
  const renderCounter = useRef(0);
  renderCounter.current = renderCounter.current + 1;
  return <>
    {renderCounter.current}
  </>;
}


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
  

  let peopleItems = get(["people", "items"], {});
  let peopleOrder = get(["people", "order"], []);


  return (
    <FillContainer>
      <FillContent
        classNames={[
          "window-content",
          
          "column",
        ]}
      >
       <div {...classes("row", 'full-height')}>
        <div {...classes("column", "tint-bkgd")} style={{
          marginRight: "5px",
          padding: "10px",
        }}>  
          {peopleOrder.map(personKey => {
            let person = peopleItems[personKey];
            return (<div {...classes("full-width")}>
              {person.name}
            </div>);
          })}
        </div>
        <div {...classes("column", "tint-bkgd", 'full-width')} style={{
          padding: "10px",
        }}>
            {get(['chat_messages'], []).map((message) => {
              let myId = get(['me', 'id']);
              let isMyMessage = message.authorId == myId;
              let personName = String(get(['people', 'items', message.authorId, 'name'], 'Someone'))
              return (<div {...classes(['row', 'chat-item', isMyMessage ? 'chat-item-mine' : 'chat-item-other'])}>
                <div className={["chat-message-author"]}>
                  {personName}
                </div>
                <div className="chat-message">
                  {message.message}
                </div>
              </div>)
            })}
            
          </div>
        </div>
      </FillContent>
      <FillFooter
        height={40}
        classNames={["footer", "actions", "center-center"]}
      >
        <div {...classes("spacer")} />
        <form {...classes("flex", "row", "full-width")}>
          <div className="form-input chat-form full-width">
            <input type="text" name="message" {...classes("full-width", "full-height", 'flex')} value={formState.message} placeholder="Aa" onChange={handleOnChange}/>
          </div>
          <div {...classes("button")} onClick={onSubmit}><SendIcon/></div>
        </form>
      </FillFooter>
    </FillContainer>
  )
}
