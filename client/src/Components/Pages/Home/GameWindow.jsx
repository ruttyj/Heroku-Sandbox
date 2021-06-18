import React, { useState } from "react";
import Utils from "./Utils";
import { useConnectionContext } from "../../../state/connectionContext";
import { useGlobalContext  } from '../../../state/globalContext';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FillContainer from "../../Containers/FillContainer/FillContainer";
import FillContent from "../../Containers/FillContainer/FillContent";
import FillFooter from "../../Containers/FillContainer/FillFooter";

const { classes } = Utils;

function Window(props) {
  const { size, position, containerSize } = props;
  const { get, set, is } = useGlobalContext();
  const { 
    isConnected,
    getSocket,
  } = useConnectionContext();
  const socket = getSocket();

return <>
    <FillContainer>
      <FillContent></FillContent>
      <FillFooter>
        <div {...classes("full", "column")}>
          <div {...classes("row", "column")}>
            <div {...classes("row", "row")}>
              <div>Deck</div>
              <div>Discard</div>
              <div>Active</div>
            </div>
            <div {...classes("full", "row")}>
              <img src="/assets/cards/cash_1.png" style={{width: 100, height: 150}}/>
              <img src="/assets/cards/cash_1.png" style={{width: 100, height: 150}}/>
              <img src="/assets/cards/cash_1.png" style={{width: 100, height: 150}}/>
              <img src="/assets/cards/cash_1.png" style={{width: 100, height: 150}}/>
              <img src="/assets/cards/cash_1.png" style={{width: 100, height: 150}}/>
            </div>
            <div {...classes("row", "column")}>
              <div>Start Game</div>
              <div>Draw cards</div>
              <div>Finish Turn</div>
            </div>
          </div>
        </div>
      </FillFooter>
    </FillContainer>
  </>;
}


export default function (windowManager, isFocused = true) {
  
  // Dragable Lists window
  windowManager.createWindow({
    title: "GameWindow",
    key: 'gameWindow',
    isFocused,
    position: {
      left: 400,
      top: 0
    },
    size: {
      width: 1000,
      height: 1000
    },
    children: (props) => {
      return (
        <Window {...props}/>
      )
    },
  });
}
