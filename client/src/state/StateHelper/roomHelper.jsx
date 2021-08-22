import React from 'react';
import roomConfigs from './roomConfigs';
import personManager from './PersonManager';
import Game from './Game';
import { useGlobalContext } from "../globalContext";
import { useConnectionContext } from '../connectionContext';
import { getRandomAnimal } from '../../Data/Animals';

export default function () {
  const { set, get, remove } = useGlobalContext();
  const { isConnected, getSocket } = useConnectionContext();
  const socket = getSocket();

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

  function getMyName() {
    return getPersonManager().getMyName();
  }

  function amIHost() {
    return getPersonManager().amIHost();
  }

  function changeMyName(name) {
    return getPersonManager().changeMyName(name);
  }

  //////////////////////////////////
  //         CONNECTION
  //////////////////////////////////
  function addConnectionListeners() {
    socket.on('time', (timeString) => {
      set(['time'], timeString);
    });

    socket.on('connection', (data) => {
      set(['connection'], data);
    })

    socket.on('debug', (data) => {
      console.log('debug', data);
    })
  }

  function removeConnectionListeners() {
    socket.off('time');
    socket.off('connection')
    socket.off('debug')
  }

  //////////////////////////////////
  //            ROOM
  //////////////////////////////////
  function joinRoom(roomCode) {
    socket.emit('join_room', roomCode);
  }

  function registerInRoom(name = null) {
    socket.emit('register_in_room', name || `Anonymous ${getRandomAnimal()}`);
  }
  function getCurrentRoom() {

  }

  function addRoomListeners() {
    socket.on('room', (data) => {
      console.log('room', data);
      set(['room'], data);
    })

    socket.on('leave_room', (data) => {
      console.log('left room');
    })

    socket.on('me', (data) => {
      console.log('me', (data));
      set(['me'], data);
    })

    socket.on('room_people_all_keyed', (payload) => {
      console.log('room_people_all_keyed', payload);
      set(['people'], payload);
    })

    socket.on('game', (payload) => {
      let currentGame = get(['game'], false);
      console.log('game', payload);
      set(['game'], payload);

      if (payload && payload.type === 'SKIPBO' && !currentGame){
        socket.emit('SKIPBO.get_everything');
        console.log('get everything');
      }
    })

    socket.on('chat_transcript', (transcript) => {
      let chatMessages = transcript.messages;
      set(['chat_messages'], chatMessages);
    })

    const SKB = (txt) => `SKIPBO.${txt}`;
    console.log('test', SKB('test'));
    // What to do with everything
    socket.on(SKB('game'),    (v) => set([SKB('game')],     v));
    socket.on(SKB('me'),      (v) => set([SKB('me')],       v));
    socket.on(SKB('players'), (v) => set([SKB('players')],  v));
    socket.on(SKB('cards'),   (v) => set([SKB('cards')],    v));
    socket.on(SKB('piles'),   (v) => set([SKB('piles')],    v));
    socket.on(SKB('deck'),    (v) => set([SKB('deck')],     v));
  }

  function removeRoomListeners() {
    socket.off('room');
    socket.off('leave_room');
    socket.off('me');
    socket.off('room_people_all_keyed');
    socket.off('game');
    socket.on('chat_transcript');
    socket.off('SKIPBO.game');
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


  function toggleReady()
  {
    socket.emit('toggle_ready');
  }

  return {
    // Room
    joinRoom,
    registerInRoom,
    // @TODO leaveRoom,
    // Me
    getMe,
    getMyName,
    changeMyName,
    amIHost,
    toggleReady,
    // Room
    getCurrentRoom,
    getRoomConfigs,
    // People
    getPersonManager,
    // Game
    getGame,
    hasGame,
    // Listeners
    addConnectionListeners,
    removeConnectionListeners,
    addRoomListeners,
    removeRoomListeners,
  }
}
