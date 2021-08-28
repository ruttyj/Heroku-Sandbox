
import React, { useState, useEffect } from 'react';
import { useConnectionContext } from '../../../../state/connectionContext';
import { useGlobalContext } from '../../../../state/globalContext';
import FillContainer from "../../../Containers/FillContainer/FillContainer";
import FillContent from "../../../Containers/FillContainer/FillContent";
import FillFooter from "../../../Containers/FillContainer/FillFooter";
import useDataHelper from '../../../../state/StateHelper/roomHelper';
import Sketch from 'react-p5';
import useParticleSystem from '../../../Sketches/Confetti/useParticleSystem';
import YouLoseMessage from './Components/YouLoseMessage/YouLoseMessage';
import YouWonMessage from './Components/YouWonMessage/YouWonMessage';
import Pile from './Components/Pile/Pile';
import PlayerCard from './Components/PlayerCard/PlayerCard';
import DrawButton from './Components/DrawButton/DrawButton';
import RelLayer  from './Components/RelLayer/RelLayer';

export default ({ window }) => {
  const [gameStatus, setGameStatus] = useState('GAME');
  const { set, get, windowManager, print } = useGlobalContext();
  const { socket, isConnected } = useConnectionContext();


  // Particle System ---------------------------------
  const particleSystem = useParticleSystem();
  function setup(p5, parentRef) {
    p5.createCanvas(320, 600).parent(parentRef);
    particleSystem.setup(p5);
    particleSystem.setIsActive(true);
    setTimeout(() => {
      //particleSystem.setIsActive(false);
    }, 1000)
  };
  function draw(p5) {
    particleSystem.render(p5);
  }
  let isSystemActive = particleSystem.getIsActive();
  const toggleSystem = () => particleSystem.setIsActive(!isSystemActive);
  //_________________________________________________



  const {
    getGame,
    getType,
  } = useDataHelper();

  const game = getGame();

  let contents = null;

  useEffect(() => {
    if(socket){
      if(game.getType() == 'SKIPBO') {
        const wrapName = (txt) => `SKIPBO.${txt}`;
        console.log('test', wrapName('test'));
        // What to do with everything
        socket.on(wrapName('game'),  (v) => set([wrapName('game')], v));
        socket.on(wrapName('piles'), (v) => set([wrapName('piles')], v));
        socket.on(wrapName('deck'),  (v) => set([wrapName('deck')], v));

        // Execute get everything
        socket.emit('SKIPBO.get_everything', true);
      } else {
        socket.off('SKIPBO.game');
      }
    }
  }, [
    game.getType(), socket
  ])

  if(game.getType() == 'SKIPBO') {
    let otherPlayerContents;
    let tableContents;
    let myTableContents;
    let myHandContents;

    const myPlayer = game.getMyPlayer();
    const myCards = myPlayer.getCards();
    const myDeckTopCard = myPlayer.getDeckTopCard();

    
    let myDeckContents;
    if (myDeckTopCard) {
      switch (myDeckTopCard.type)
      {
        case 'NUMBER':
          myDeckContents = <>
            <Pile>
              {myDeckTopCard.value}
            </Pile>
          </>
          break;
        case 'WILD':
          myDeckContents = <>
            <Pile>
              W
            </Pile>
          </>
      }
    }
   

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


        <DrawButton
          onClick={(e) => {
            console.log('hi');
          }} 
        />


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
        {myDeckContents}
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
          {myCards.map(card => {
            switch (card.type)
            {
              case 'NUMBER':
                return <>
                  <Pile key={card.id}>
                    {card.value}
                  </Pile>
                </>
              case 'WILD':
                return <>
                  <Pile key={card.id}>
                    W
                  </Pile>
                </>
            }
          })}
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
      

      {/* ------- Game ------- */}
      <div style={{
        ...absolute
      }}>
        {contents}
      </div>


      { gameStatus == 'WIN' && 
        <>
          {/* ------- Confetti ------- */}
          <div style={{
            ...absolute,
            pointerEvents: 'none'
          }}>
            <Sketch setup={setup} draw={draw} />
          </div>
          {/* ------- YouWonMessage ------- */}
          <div style={{
            ...absolute,
            pointerEvents: 'none'
          }}>
            <YouWonMessage></YouWonMessage>
          </div>
        </>
      }


      { gameStatus == 'LOSE' && 
        <>
          {/* ------- YouLoseMessage ------- */}
          <div style={{
            ...absolute,
            backgroundColor: '#000000c2',
          }}>
            <YouLoseMessage></YouLoseMessage>
          </div>
        </>
      }
    </div>
  </>  
}
