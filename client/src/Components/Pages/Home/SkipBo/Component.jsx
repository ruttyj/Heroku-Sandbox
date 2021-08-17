
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

function Pile({children, color='#0871bc'}) {
  return <div style={{
    display: 'inline-block',
    height: '55px',
    width: '35px',
    backgroundColor: color,
    margin: "3px",
    content: "",
  }}>
    {children}
  </div>
}

function DrawButton({children, color='#0871bc'})
{
  return <>
    <div style={{
      padding: "10px",
      height: '55px',
      width: '70px',
      backgroundColor: color,
      textAlign: 'center',
    }}>
      Draw
    </div>
  </>
}

function PlayerCard() {
  return <>
    <div className="row" 
      style={{
        justifyContent: "space-between",
        width: "100%",
        backgroundColor: "#00000070",
        marginTop: "6px",
      }}
    >
      <div>
        Name
      </div>
      <div>
        <Pile></Pile>
        <Pile></Pile>
        <Pile></Pile>
        <Pile></Pile>
      </div>
      <Pile></Pile>
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
    let otherPlayerContents;
    let tableContents;
    let myTableContents;
    let myHandContents;

    // The contents of other players
    otherPlayerContents = <>
      <div>
        <PlayerCard></PlayerCard>
        <PlayerCard></PlayerCard>
        <PlayerCard></PlayerCard>
        <PlayerCard></PlayerCard>
        <PlayerCard></PlayerCard>
        <PlayerCard></PlayerCard>
        <PlayerCard></PlayerCard>
        <PlayerCard></PlayerCard>
      </div>
    </>;

    // Contents of the main piles and draw pile
    tableContents = <>
      <div 
        className="row" 
        style={{
          justifyContent: "space-between",
          width: "100%",
          marginBottom: '15px',
          marginTop: '15px',
          backgroundColor: '#00000047',
          padding: '5px',
        }}
      >
        <DrawButton color="#2d8c0e">
          Draw
        </DrawButton>
        <div
        className="row" 
        style={{
          width: "100%",
          justifyContent: "center",
        }}
        >
          <div
            className="row" 
            style={{
              
            }}
          >
            <Pile color="white"></Pile>
            <Pile color="white"></Pile>
            <Pile color="white"></Pile>
            <Pile color="white"></Pile>
          </div>
        </div>
      </div>
    </>;

    // What I currently have on the table 
    myTableContents = <>
      <div 
        className="row" 
        style={{
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div
        className="row" 
        style={{
          width: "100%",
          justifyContent: "center",
        }}
        >
          <Pile></Pile>
          <Pile></Pile>
          <Pile></Pile>
          <Pile></Pile>
        </div>
        <Pile></Pile>
      </div>
    </>;

    // My Hand
    myHandContents = <>
     <div 
        className="row" 
      >
        <Pile></Pile>
        <Pile></Pile>
        <Pile></Pile>
        <Pile></Pile>
        <Pile></Pile>
      </div>
  </>;

    // The screen
    contents = <>
      <FillContainer>
        <FillContent
          classNames={[
            "column",
          ]}
          style={{
            overflow: "auto",
          }}
        >
          <FillContainer>
            <FillContent
              classNames={[
                "column",
              ]}
              style={{
                overflow: "auto",
              }}
            >
              <FillContainer>
                <FillContent
                  classNames={[
                    "column",
                  ]}
                  style={{
                    overflow: "auto",
                  }}
                >
                  {otherPlayerContents}
                </FillContent>
                <FillFooter
                  height={40}
                  classNames={["footer", "actions", "center-center"]}
                >
                  {tableContents}
                </FillFooter>
              </FillContainer>
            </FillContent>
            <FillFooter
              height={40}
              classNames={["footer", "actions", "center-center"]}
            >
              {myTableContents}
            </FillFooter>
          </FillContainer>
        </FillContent>
        <FillFooter
          height={40}
          classNames={["footer", "actions", "center-center"]}
        >
          {myHandContents}
        </FillFooter>
      </FillContainer>
    </>
  } else {
    contents = <>
      No Game in progress
    </>
  }

  // Display the combined contents
  return (
  <>
    {contents}
  </>  
  )
}
