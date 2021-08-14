import React from 'react';
import { useGlobalContext } from "../../../../state/globalContext";
import { useConnectionContext } from '../../../../state/connectionContext';
import useDataHelper from '../../../../state/StateHelper/roomHelper';
import createRenameWindow from "../RenameWindow";

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
export default function ({ children, position, size }) {
  const { get, set, map, windowManager } = useGlobalContext();
  const {
    getSocket,
  } = useConnectionContext();
  const socket = getSocket();

  const {
    getMe,
    amIHost,
    getRoomConfigs,
  } = useDataHelper({ get, set, socket });

  const print = (v) => <pre>{JSON.stringify(v, null, 2)}</pre>;

  let me = getMe();
  let isHost = amIHost();


  const onOpenEditName = () => {
    console.log(position);
    createRenameWindow(windowManager, {
      isFocused: true,
      position: {
        top: position.top + size.height / 2 - 100,
        left: position.left + 0,
      }
    })
  }


  return <>
    <Wrapper>
      {isHost
        ? <>
          <div>
            You are the Host
          </div>
        </>
        : <>
          <div>
            You are not the Host
          </div>
        </>
      }
      {print(me.name)}
      {print(me)}
      <button onClick={() => { onOpenEditName() }}>Change My Name</button>

    </Wrapper>
  </>
}