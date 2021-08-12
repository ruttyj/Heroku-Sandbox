import React, { useRef, useState, useEffect } from 'react';
import { useGlobalContext  } from "../../../../state/globalContext";
import { useConnectionContext } from '../../../../state/connectionContext';
import Switch from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

///////////////////////////////////////////////////////////////////
//                           Wrapper
///////////////////////////////////////////////////////////////////
const Wrapper = function({children}) {
  return <>
    <div className="full" style={{display:"block"}}>
      <div style={{position: 'relative'}}>
        {children}
      </div>
    </div>
  </>
}

///////////////////////////////////////////////////////////////////
//                          TextInput
///////////////////////////////////////////////////////////////////
const TextInput = function({label="", value="", onValueChange=()=>{}}) {
  const [inputValue, setValue] = useState(value);
  useEffect(() => {
    setValue(value)
  }, [value]);
  return <div>
    {label}
    <input 
      type="text" 
      name="value"
      value={inputValue}
      onChange={(e) => setValue(e.target.value)}
    />
    <input type="button" onClick={(e) => onValueChange(inputValue)}/>
  </div>
}

const SwitchInput = function({label="", value="", readOnly=false, onValueChange=()=>{}}) {
  return <div>
    {label}
    <Switch
        checked={value ? true : false}
        value={value}
        disabled={readOnly}
        onChange={(e) => {
          onValueChange(!value);
        }}
        name="checkedA"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
  </div>
}
 

const SelectInput = function({label="", value="", options=[], readOnly=false, onValueChange=()=>{}}) {
  return <div>
    {label}
    <select
        checked={value ? true : false}
        value={value}
        disabled={readOnly}
        onChange={(e) => {
          console.log(e.target.value);
          onValueChange(e.target.value);
        }}
        name="checkedA"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      >
        {options.map((value) => {
          return <>
            <option key={value} value={value}>{value}</option>
          </>
        })}
      </select>
  </div>
}

///////////////////////////////////////////////////////////////////
//                          COMPONENT
///////////////////////////////////////////////////////////////////
export default function({children}) {
  const {get, set, map} = useGlobalContext();
  const { 
    isConnected,
    getSocket,
  } = useConnectionContext();
  const socket = getSocket();

  const basePath = ['room', 'configs'];

  let myId = get(['me']);
  let people = get(['people']);
  let me = get(['people', 'items', myId]);
  let isHost = me ? me.tags.includes("host") : false;



  let label = get([...basePath, 'fields', 'items', 'IS_ROOM_OPEN', 'label']);
  let value = get([...basePath, 'values', 'IS_ROOM_OPEN']);
  let onValueChange = (v) => socket.emit('change_room_config', {key: 'IS_ROOM_OPEN', value: v});
  const print = (v) => <pre>{JSON.stringify(v, null, 2)}</pre>;

  const hostContents = <>
    <div>
      You are the Host
    </div>
    <SwitchInput 
      label={label}
      value={value}
      readOnly={!isHost}
      onValueChange={onValueChange}
    /> 

    {print(get([...basePath, 'values', 'GAME_TYPE']))}
    <SelectInput
      value={get([...basePath, 'values', 'GAME_TYPE'])}
      label={get([...basePath, 'fields', 'items', 'GAME_TYPE', 'label'])}
      options={get([...basePath, 'fields', 'items', 'GAME_TYPE', 'options'])}
      onValueChange={(v) => socket.emit('change_room_config', {key: 'GAME_TYPE', value: v})}
    />
    {print(get([...basePath, 'fields', 'items', 'GAME_TYPE', 'options']))}

    <pre>{JSON.stringify(get([...basePath, 'fields', 'items', 'GAME_TYPE', 'options']), null, 2)}</pre>
  </>


  const readOnlyContents = <>
    <div>
      {label} : {value ? 'True' : 'False'}
    </div>
    <pre>{JSON.stringify(get(['room', 'configs', 'values']), null, 2)}</pre>
  </>


  return <>
    <Wrapper>
      {isHost ? hostContents : readOnlyContents}
    </Wrapper>
  </>
}