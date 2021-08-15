import React from 'react';
import roomConfigs from './roomConfigs';
import personManager from './PersonManager';
import Game from './Game';

export default function ({ get, set, socket }) {

  function getRoomConfigs() {
    return roomConfigs({ get, set, socket });
  }

  function getPersonManager() {
    return personManager({ get, set, socket });
  }



  //////////////////////////////////
  //              ME
  //////////////////////////////////
  function getMe() {
    return getPersonManager().getMe();
  }

  function amIHost() {
    return getPersonManager().amIHost();
  }

  function changeMyName(name) {
    return getPersonManager().changeMyName(name);
  }


  //////////////////////////////////
  //            ROOM
  //////////////////////////////////
  function getCurrentRoom() {

  }


  //////////////////////////////////
  //            GAME
  //////////////////////////////////
  function getGame() {
    return new Game({ get, socket });
  }

  function hasGame() {
    let game = getGame();
    return game ? true : false;
  }

  return {
    getMe,
    changeMyName,
    amIHost,
    getCurrentRoom,
    getRoomConfigs,
    getPersonManager,
    getGame,
    hasGame,
  }
}
