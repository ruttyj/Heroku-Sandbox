export default function ({ get, socket }) {

  function getPeople() {
    let peopleItem = get(['people', 'items'], {});
    let peopleOrder = get(['people', 'order'], [])

    return peopleOrder.map(personId => peopleItem[personId]);
  }

  function getMe() {
    let myId = get(['me']);
    let me = get(['people', 'items', myId], {});
    return me;
  }

  function getMyName() {
    const me = getMe();
    return me.name || "";
  }

  function amIHost() {
    let me = getMe();
    let isHost = me && me.tags ? me.tags.includes("host") : false;
    return isHost;
  }

  function changeMyName(name) {
    socket.emit("change_my_name", name);
  }


  return {
    getPeople,
    getMe,
    getMyName,
    amIHost,
    changeMyName,
  }
}