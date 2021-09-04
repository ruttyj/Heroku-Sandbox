const SocketRegistry = require('../lib/Registry');
const handlers = new SocketRegistry();
const Person = require('../models/Person')

// Debug  =======================================================
const Log = require('../handlers/Debug/Log');


// Person  ======================================================
const NotifyRoomOfAllPeople = require('../handlers/Room/Person/NotifyRoomOfAllPeople');
const NotifyRoomOfUpdate = require('../handlers/Room/NotifyRoomOfUpdate');
const IsHost = require('../handlers/Room/Person/IsHost');
const requirePersonInRoom = require('./requirePersonInRoom');

// Chat =========================================================
const Message = require('../handlers/Room/Chat/Message');


const connectionController = require('../controllers/Connection/Connection');
const roomController = require('../controllers/Room/Room');
const personController = require('../controllers/Person/Person');


// Game =========================================================
const StartGame = require('../handlers/Room/Game/Start');


// Connection  ==================================================
handlers.public('get_connection', connectionController.get());
handlers.public('disconnect',     connectionController.disconnect());

// Room  ========================================================
handlers.public('join_room',  roomController.join());
handlers.public('get_room',   roomController.get());

// Person  ======================================================
handlers.public('register_in_room', personController.register());
handlers.public('change_my_name',   personController.changeMyName());
handlers.public('toggle_ready',     personController.toggleReady());
handlers.public('leave_room',       personController.leave());




handlers.public('set_host', ((new IsHost((req, res) => {
  const me = req.get('person');
  const room = req.get('room');
  const newHostId = req.getPayload();
  //------------------------------------------

  const people = room.getPeople();
  if (people.has(newHostId)) {
    const newHost = people.get(newHostId);
    newHost.addTag(Person.TYPE_HOST);
    me.removeTag(Person.TYPE_HOST);

    (new NotifyRoomOfAllPeople()).execute(req, res);
  }
}))));



handlers.public('change_room_config', new IsHost((req, res) => {
  const payload = req.getPayload();
  const room = req.get('room');
  //------------------------------------------
  try {
    const key = payload.key;
    const value = payload.value;

    const roomConfigs = room.getConfig();
    if (roomConfigs.hasField(key)) {
      roomConfigs.updateField(key, value);

      (new NotifyRoomOfUpdate()).execute(req, res);
    }
  } catch (e) {
    console.log(e);
  }
}));

// Chat =========================================================
handlers.public('message', requirePersonInRoom(new Message()));


handlers.public('start_game', new StartGame());



// @TODO wrap handler in skipbo protection
handlers.public('SKIPBO.get_everything', requirePersonInRoom((req, res) => {
  const con = req.getConnection();
  const me = req.get('person');
  const room = req.get('room');

  // Assuming Game has been selected and no game is in progress
  const game = room.getGame();
  con.emit('SKIPBO.game',     game.serialize());
  con.emit('SKIPBO.cards',    game.serializeCards());
  con.emit('SKIPBO.players',  game.serializePlayers());
  con.emit('SKIPBO.deck',     game.serializeDeck());
  con.emit('SKIPBO.piles',    game.serializePiles());
  con.emit('SKIPBO.players',  game.serializePlayers());

  const personManager = game.getPlayerManager();
  const playerList = personManager.getPlayerList();

  const myId = me.getId();
  const myPlayer = playerList.find(player => player.getPersonId() === myId);
  console.log('myPlayer', myPlayer);
  con.emit('SKIPBO.me',  myPlayer.serializeMe());

  



  // me
    // my_hand
    // my_piles
    // my_deck
  // other_players
    // other_hands
    // other_piles
    // other_decks

  console.log('get everything');
}))



module.exports = handlers;
