import React, { useState } from "react";
import Utils from "./Utils";
import { useConnectionContext } from "../../../state/connectionContext";
import { useGlobalContext  } from '../../../state/globalContext';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const { classes } = Utils;
const isBool = (v) => (v === true || v === false);
const { isObj, isArr, isDef } = Utils;
const isNumber = (v) => !Number.isNaN(v);

function RenderInput({item, path=[]}) {
  const { get, set, is } = useGlobalContext();

  let contents = [];
  if(isObj(item)) {
    Object.keys(item).forEach((key) => {
      let localPath = [...path, key];
      
      contents.push(
        <div {...classes('row')}>
          <div {...classes('column')}>
            {key}
          </div>
          <div {...classes('column')}>
            <RenderInput item={item[key]} path={localPath}/>
          </div>
        </div>
      )
    })
  } else if (isBool(item)) {
    contents.push(
      <div {...classes('row')}>
        <div {...classes('column')}>
          <Switch
            checked={item}
            onChange={() => set(path, !get(path, false))}
          />
        </div>
      </div>
    )
  } else if (isNumber(item)) {
    contents.push(
      <div {...classes('row')}>
        <div {...classes('column')}>
          <input type="text" value={item}/>
          <Button/>
        </div>
      </div>
    )
  }


  return (
    <div>
      {contents}
    </div>
  )
}



function Window(props) {
  const { size, position, containerSize } = props;
  const { get, set, is } = useGlobalContext();
  const { 
    isConnected,
    getSocket,
  } = useConnectionContext();
  const socket = getSocket();


  const everything = get([]);


  return <div {...classes("full", "column")}>
    Game Window
    <RenderInput item={everything}/>
  </div>;
}


export default function (windowManager, isFocused = true) {
  
  // Dragable Lists window
  windowManager.createWindow({
    title: "GameWindow",
    key: 'gameWindow',
    isFocused,
    position: {
      left: 700,
      top: 50
    },
    size: {
      width: 500,
      height: 500
    },
    children: (props) => {
      return (
        <Window {...props}/>
      )
    },
  });
}
