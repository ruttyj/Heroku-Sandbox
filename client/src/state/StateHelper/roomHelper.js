import roomConfigs from './roomConfigs';

export default function useDataHelper({get, set, socket}) {

  function getRoomConfigs()
  {
    return roomConfigs({get, set, socket});
  }

  //////////////////////////////////
  //              ME
  //////////////////////////////////
  function getMe()
  {
    let myId = get(['me']);
    let people = get(['people']);
    let me = get(['people', 'items', myId]);
    return me;
  }

  function amIHost()
  {
    let me = getMe();
    let isHost = me ? me.tags.includes("host") : false;
    return isHost;
  }

  function getCurrentRoom()
  {

  }


  return {
    getMe,
    amIHost,
    getCurrentRoom,
    getRoomConfigs,
  }
}
