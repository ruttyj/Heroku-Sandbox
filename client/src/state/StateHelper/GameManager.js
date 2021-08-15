export default function ({ get, socket }) {

  function getGame() {
    return get(['game']);
  }

  return {
    getGame,
  }
}