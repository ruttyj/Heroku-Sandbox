
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


function Pile({children}) {
  return <div style={{
    display: 'inline-block',
    height: '150px',
    width: '75px',
    backgroundColor: '#00000010',
  }}>
    {children}
  </div>
}


function PlayerCard() {
  return <>
    <div className="row" style={{
      width: "100%",
      alignContent: "space-between",
      display: "flex",
      backgroundColor: "#00000020",
    }}>
      <div>
        Person
      </div>
      <div>
        Cards
      </div>
      <div>
        Piles
      </div>
      <Pile>
        CardStack
      </Pile>
    </div>
  </>
}

export default ({ window }) => {
  const { windowManager, print } = useGlobalContext();
  const { isConnected } = useConnectionContext();

  const {
    getMyName,
    changeMyName,
    getGame,
    getType,
  } = useDataHelper();

  const game = getGame();




  let contents = null;

  if(game.getType() == 'SKIPBO') {
    let gameContents;
    let gameFooter;
    let reservePiles;

    gameContents = <>
      <div>
        Skipbo
        {print(game.getType())}
        {print(game.serialize())}
        <PlayerCard></PlayerCard>
        <PlayerCard></PlayerCard>
        <PlayerCard></PlayerCard>
        <PlayerCard></PlayerCard>
        <PlayerCard></PlayerCard>
      </div>
    </>;


    reservePiles = <>
      <div 
        className="row" 
      >
        <Pile>Reserve Slot</Pile>
        <Pile>Reserve Slot</Pile>
        <Pile>Reserve Slot</Pile>
        <Pile>Reserve Slot</Pile>
      </div>
    </>

    gameFooter = <>
      <div 
        className="row" 
        style={{
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Pile>Deck</Pile>
        {reservePiles}
        <Pile>CardStack</Pile>
      </div>
    </>;

    contents = <>
      <FillContainer>
        <FillContent
          classNames={[
            "window-content",
            "column",
          ]}
        >
          {gameContents}
        </FillContent>
        <FillFooter
          height={40}
          classNames={["footer", "actions", "center-center"]}
        >
          {gameFooter}
        </FillFooter>
      </FillContainer>
    </>
  } else {
    contents = <>
      No Game in progress
    </>
  }








  return (
  <>
    {contents}
  </>  
  )
}
