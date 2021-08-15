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

    socket.on('room_list', (payload) => {
      set(['room_list'], payload.data);
    })


    socket.on('room_people_all_keyed', (payload) => {
      console.log('room_people_all_keyed', payload);
      set(['people'], payload);
    })

    socket.on('game', (payload) => {
      console.log('game', payload);
      set(['game'], payload);
    })

    socket.on('chat_transcript', (transcript) => {
      let chatMessages = transcript.messages;
      set(['chat_messages'], chatMessages);
    })
  }

  function removeRoomListeners() {
    socket.off('room');
    socket.off('leave_room');
    socket.off('me');
    socket.off('room_list');
    socket.off('room_people_all_keyed');
    socket.off('game');
    socket.on('chat_transcript');
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
    joinRoom,
    registerInRoom,
    getMe,
    changeMyName,
    amIHost,
    getCurrentRoom,
    getRoomConfigs,
    getPersonManager,
    getGame,
    hasGame,
    addConnectionListeners,
    removeConnectionListeners,
    addRoomListeners,
    removeRoomListeners,
  }
}
