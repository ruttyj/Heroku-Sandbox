export default function ({ get, socket }) {

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

  return {
    startGame,
    isInProgress,
    serialize,
    getType,
  }
}