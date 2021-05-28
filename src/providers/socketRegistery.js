const SocketHandler = require('../lib/ActionHandler');
const SocketRegistry = require('../lib/Registry');
      
// Connection type  =============================================
const ConnectionGetTypeHandler = require('../handlers/Connection/GetType');
const ConnectionSetTypeHandler = require('../handlers/Connection/SetType');
const RoomJoinHandler = require('../handlers/Room/Join');
const RoomGetHandler = require('../handlers/Room/Get');

// Rooms ========================================================
const socketRegistry = new SocketRegistry();
socketRegistry.registerPublic('get_connection_type', new ConnectionGetTypeHandler());
socketRegistry.registerPublic('set_connection_type', new ConnectionSetTypeHandler());
socketRegistry.registerPublic('join_room', new RoomJoinHandler());
socketRegistry.registerPublic('get_room_list', new RoomGetHandler());

module.exports = socketRegistry;