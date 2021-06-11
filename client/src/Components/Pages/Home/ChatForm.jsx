
import React, { useState, useRef } from 'react';
import { useConnectionContext } from '../../../state/connectionContext';
import { useGlobalContext  } from '../../../state/globalContext';
import FillContainer from "../../Containers/FillContainer/FillContainer";
import FillContent from "../../Containers/FillContainer/FillContent";
import FillFooter from "../../Containers/FillContainer/FillFooter";
import SendIcon from '@material-ui/icons/Send';
import EditIcon from '@material-ui/icons/Edit';
import Utils from "../../../Utils";
import { map } from 'lodash';
import createRenameWindow from "./RenameWindow";
import randomEmoji from "../../../Utils/randomEmoji";
const { classes } = Utils;


function RenderCounter()
{
  const renderCounter = useRef(0);
  renderCounter.current = renderCounter.current + 1;
  return <>
    {renderCounter.current}
  </>;
}


export default (props) => {

  const initialFormState = {
    message: randomEmoji(),
  };
  const [formState, setFormState] = useState(initialFormState);
  const { set, get, remove, windowManager } = useGlobalContext();


  const position = props.position;

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
  

  const peopleItems = get(["people", "items"], {});
  const peopleOrder = get(["people", "order"], []);
  const myId = get(['me', 'id']);


  const onOpenEditName = () => {
    console.log(position);
    createRenameWindow(windowManager, {
      isFocused: true
    })
  }

  const userPanel = <div {...classes("column", "tint-bkgd")} style={{
    marginRight: "5px",
    padding: "10px",
    minWidth: "120px"
  }}>  
    {peopleOrder.map(personKey => {
      let person = peopleItems[personKey];
      let isMe = person.id == myId;
      return (<div {...classes("full-width", "row", "chat-participant")} key={person.id}>
        <div {...classes("grow")}>
          {person.name}
        </div>
        {isMe ? <EditIcon onClick={() => onOpenEditName()} fontSize="small"  {...classes("edit-name")}/> : ''}
      </div>);
    })}
  </div>




  return (
    <FillContainer>
      <FillContent
        classNames={[
          "window-content",
          "column",
        ]}
      >
       <div {...classes("row", 'full-height')}>
        {userPanel}
        <div {...classes("column", "tint-bkgd", 'full-width')} style={{
          padding: "10px",
        }}>
            {get(['chat_messages'], []).map((message) => {
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
