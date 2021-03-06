import React from 'react';
import { useGlobalContext } from "../../../../state/globalContext";
import { useConnectionContext } from '../../../../state/connectionContext';
import SwitchInput from './Inputs/SwitchInput';
import SelectInput from './Inputs/SelectInput';

import useDataHelper from '../../../../state/StateHelper/roomHelper';
///////////////////////////////////////////////////////////////////
//                           Wrapper
///////////////////////////////////////////////////////////////////
const Wrapper = function ({ children }) {
  return <>
    <div className="full" style={{ display: "block" }}>
      <div style={{ position: 'relative' }}>
        {children}
      </div>
    </div>
  </>
}


///////////////////////////////////////////////////////////////////
//                          COMPONENT
///////////////////////////////////////////////////////////////////
export default function ({ children }) {
  const print = (v) => <pre>{JSON.stringify(v, null, 2)}</pre>;
  const { get, set, map } = useGlobalContext();
  const {
    getSocket,
  } = useConnectionContext();
  const socket = getSocket();

  const {
    amIHost,
    getRoomConfigs,
    getGame,
    hasGame,
  } = useDataHelper();

  const roomConfigs = getRoomConfigs();
  let isHost = amIHost();


  const game = getGame();
  const gameData = game.serialize();

  return <>
    <Wrapper>
      {isHost
        ? <>
          <div>
            You are the Host
          </div>
        </>
        : <>

        </>
      }

      <fieldset>
        <SwitchInput
          label={roomConfigs.getField('IS_ROOM_OPEN').label}
          value={roomConfigs.getValue('IS_ROOM_OPEN')}
          readOnly={!isHost}
          onValueChange={(v) => roomConfigs.updateFieldValue('IS_ROOM_OPEN', v)}
        />
        <SelectInput
          label={roomConfigs.getField('GAME_TYPE').label}
          value={roomConfigs.getValue('GAME_TYPE')}
          options={roomConfigs.getField('GAME_TYPE').options}
          readOnly={!isHost}
          onValueChange={(v) => roomConfigs.updateFieldValue('GAME_TYPE', v)}
        />
      </fieldset>





      {hasGame() && <>
        <div>
          Game: {print(gameData)}
        </div>

        {game.isInProgress()
          ? <>
            Game In Progress
          </>
          : <>
            {isHost
              ? <>
                <div>
                  <button onClick={() => game.startGame()}>Start Game</button>
                </div>
              </>
              : <>
                <div>
                  <button>Ready Up</button>
                </div>
              </>
            }
          </>
        }


      </>}

    </Wrapper>
  </>
}