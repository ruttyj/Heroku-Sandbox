
import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue } from "framer-motion";
import { useConnectionContext } from '../../../../state/connectionContext';
import { useGlobalContext } from '../../../../state/globalContext';
import FillContainer from "../../../Containers/FillContainer/FillContainer";
import FillContent from "../../../Containers/FillContainer/FillContent";
import FillFooter from "../../../Containers/FillContainer/FillFooter";
import Utils from "../../../../Utils";
import TextField from '@material-ui/core/TextField';
import useDataHelper from '../../../../state/StateHelper/roomHelper';
import Sketch from 'react-p5';
import useParticleSystem from '../../../Sketches/Confetti/useParticleSystem';

const { classes } = Utils;

function Pile({children, color='#0871bc'}) {
  const dragOriginX = useMotionValue(0);
  const dragOriginY = useMotionValue(0);


  function getDropZoneByCoord(x, y) {
    const hoverElement = document.elementFromPoint(x, y);
    const closestDroppable = hoverElement.closest('.droppable');

    if (closestDroppable && closestDroppable.dataset) {
      console.log('closestDroppable', closestDroppable);
    }

    return null;
  }


  const onDragEnd = (e, info) => {
    
    dragOriginX.set(0);
    dragOriginY.set(0);

    console.log(e);
    getDropZoneByCoord(e.clientX, e.clientY);
  }
  
  return <>
    <div
      className="droppable"
      style={{
        display: 'inline-block',
        height: '61px',
        width: '41px',
        backgroundColor: '#00000050',
        margin: "3px",
        content: "",
      }}
    >
      <motion.div 
        drag
        onDragEnd={onDragEnd}
        x={dragOriginX}
        y={dragOriginY}
        style={{
          display: 'inline-block',
          height: '55px',
          width: '35px',
          backgroundColor: color,
          margin: "3px",
          content: "",
      }}>
        {children}
      </motion.div>
    </div>
  </>
}

function DrawButton({children, onClick=()=>{}, color='#0871bc'})
{
  return <>
    <div
      onCLick={onClick} 
      style={{
        padding: "10px",
        height: '55px',
        width: '70px',
        backgroundColor: color,
        textAlign: 'center',
      }}
    >
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

  const particleSystem = useParticleSystem();

  function setup(p5, parentRef) {
    p5.createCanvas(320, 600).parent(parentRef);
    particleSystem.setup(p5);
    particleSystem.setIsActive(true);
    setTimeout(() => {
      particleSystem.setIsActive(false);
    }, 1000)
  };

  function draw(p5) {
    particleSystem.render(p5);
  }

  let isSystemActive = particleSystem.getIsActive();
  const toggleSystem = () => particleSystem.setIsActive(!isSystemActive);

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
        <DrawButton onClick={() => toggleSystem()} color="#2d8c0e">
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
        }}
        >
          <div 
            className="row" 
          >
            <div style={{
              width: "60px",
            }}>
              Piles
            </div>
            <div 
              className="row" 
              style={{
                justifyContent: "center",
              }}
            >
              <Pile></Pile>
              <Pile></Pile>
              <Pile></Pile>
              <Pile></Pile>
            </div>
          </div>
        </div>
        <Pile></Pile>
      </div>
    </>;

    // My Hand
    myHandContents = <>
      <div 
        className="row" 
      >
        <div style={{
          width: "60px",
        }}>
          Hand
        </div>
        <div 
          className="row" 
        >
          <Pile></Pile>
          <Pile></Pile>
          <Pile></Pile>
          <Pile></Pile>
          <Pile></Pile>
        </div>
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
          classNames={["footer", "actions"]}
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


  const absolute = {
    position: 'absolute',
    width: '100%',
    height: '100%',
  }

  // Display the combined contents
  return <>
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
    }}>
      <div style={{
        ...absolute
      }}>
        {contents}
      </div>
      <div style={{
        ...absolute,
        pointerEvents: 'none'
      }}>
        <Sketch setup={setup} draw={draw} />
      </div>
    </div>
  </>  
}
