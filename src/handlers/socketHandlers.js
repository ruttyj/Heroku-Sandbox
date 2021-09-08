const HandlerRegistry = require('../lib/Registry');

// Controllers ==================================================
const connectionController = require('../controllers/Connection/Connection');
const roomController = require('../controllers/Room/Room');
const personController = require('../controllers/Person/Person');
const roomConfigController = require('../controllers/Room/RoomConfig');
const ChatController = require('../controllers/Chat/Chat');
const skipBoController = require('../controllers/Games/SkipBo/SkipBo');

// Game =========================================================
const baseGameCntroller = require('../controllers/Games/BaseGame');




const handlers = new HandlerRegistry();

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

// Chat =========================================================
handlers.public('message', ChatController.sendMessage());

// Room Config ==================================================
handlers.public('change_room_config', roomConfigController.updateConfig());


// Base Game ====================================================
handlers.public('start_game',       baseGameCntroller.startGame());
//handlers.public('end_game',         baseGameCntroller.endGame());


// ==============================================================
// @TODO wrap handler in skipbo protection
handlers.public('SKIPBO.get_everything', skipBoController.getEverything());



module.exports = handlers;
