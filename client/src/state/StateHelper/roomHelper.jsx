import React from 'react';
import roomConfigs from './roomConfigs';

export default function ({ get, set, socket }) {
  function getRoomConfigs() {
    return roomConfigs({ get, set, socket });
  }

  //////////////////////////////////
  //              ME
  //////////////////////////////////
  function getMe() {
    let myId = get(['me']);
    let people = get(['people']);
    let me = get(['people', 'items', myId], {});
    return me;
  }

  function amIHost() {
    let me = getMe();
    let isHost = me && me.tags ? me.tags.includes("host") : false;
    return isHost;
  }

  function changeMyName(name) {
    socket.emit("change_my_name", name);
  }

  function getCurrentRoom() {

  }


  return {
    getMe,
    changeMyName,
    amIHost,
    getCurrentRoom,
    getRoomConfigs,
  }
}
