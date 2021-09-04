const SocketRegistry = require('../lib/Registry');
const handlers = new SocketRegistry();
const Person = require('../models/Person')

// Debug  =======================================================
const Log = require('../handlers/Debug/Log');


// Person  ======================================================
const NotifyRoomOfUpdate = require('../handlers/Room/NotifyRoomOfUpdate');
const IsHost = require('../handlers/Room/Person/IsHost');
const requirePersonInRoom = require('./requirePersonInRoom');

// Chat =========================================================
const Message = require('../handlers/Room/Chat/Message');

const connectionController = require('../controllers/Connection/Connection');
const roomController = require('../controllers/Room/Room');
const personController = require('../controllers/Person/Person');
const skipBoController = require('../controllers/Games/SkipBo/SkipBo');

// Game =========================================================
const StartGame = require('../handlers/Room/Game/Start');


// Connection  ==================================================
handlers.public('get_connection',   connectionController.get());
handlers.public('disconnect',       connectionController.disconnect());

// Room  ========================================================
handlers.public('join_room',        roomController.join());
handlers.public('get_room',         roomController.get());

// Person  ======================================================
handlers.public('register_in_room', personController.register());
handlers.public('change_my_name',   personController.changeMyName());
handlers.public('set_host',         personController.setHost());
handlers.public('toggle_ready',     personController.toggleReady());
handlers.public('leave_room',       personController.leave());



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
handlers.public('SKIPBO.get_everything', skipBoController.getEverything());



module.exports = handlers;
