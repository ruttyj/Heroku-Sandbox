import MyPlayer from './MyPlayer';

export default function ({ get, socket }) {

  const wrapName = (txt) => `SKIPBO.${txt}`;

  function startGame() {
    socket.emit('start_game');
  }

  function serialize() {
    return get(['game'], {});
  }

  function isInProgress() {
    return get(['game', 'isInProgress'], false);
  }

  function getType() {
    return get(['game', 'type'], null);
  }

  function getMyPlayer()
  {
    return MyPlayer({ 
      get, 
      socket, 
      wrapName,
      game: getPublic(),
    });
  }

  function getCard(cardId)
  {
    return get([wrapName('cards'), cardId], null);
  }

  function getPublic()
  {
    return {
      startGame,
      isInProgress,
      serialize,
      getType,
      getMyPlayer,
      getCard,
    }
  }

  return getPublic()
}