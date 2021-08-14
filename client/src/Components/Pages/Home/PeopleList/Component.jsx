import React from 'react';
import { useGlobalContext } from "../../../../state/globalContext";
import { useConnectionContext } from '../../../../state/connectionContext';
import useDataHelper from '../../../../state/StateHelper/roomHelper';
import Chip from '@material-ui/core/Chip';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
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
  const print = (v) => <pre>{JSON.stringify(v, null, 2)}</pre>;
  const { get, set, map, windowManager } = useGlobalContext();
  const {
    getSocket,
  } = useConnectionContext();
  const socket = getSocket();

  const {
    getMe,
    amIHost,
    getPersonManager,
  } = useDataHelper({ get, set, socket });

  const personManager = getPersonManager();
  const people = personManager.getPeople();

  let me = getMe();
  let isHost = amIHost();

  return <>
    <Wrapper>
      {people.map(person => {
        return <>
          <div className={"person-item"}>
            {person.name}<br />
            {print(person)}

            {person.tags
              && person.tags.includes('connected')
              && <>
                <div style={{ color: '#00FF33' }}>
                  Connected
                </div>
              </>}
            <hr />
          </div>
        </>
      })}
    </Wrapper>
  </>
}