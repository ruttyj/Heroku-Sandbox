const SocketHandler = require('../../lib/ActionHandler');
const Room = require('../../models/Room');
const Connection = require('../../models/Connection');
// ==============================================================
// Join Room
// ==============================================================
module.exports = class extends SocketHandler {
  execute(req, res) {
    const connection = req.getConnection();
    const app = connection.getApp();
    const roomManager = app.getManager('room');
    const roomCode = req.getPayload();

    //---------------------------------
    let roomTitle = roomCode;

    // Create room data
    const roomData = {
      code:         roomCode,
      title:        roomTitle,
      joinable:     true,
      mode:         Room.MODE_SETUP,
    }

    let room;
    let roomId = connection.getRoomId();
    if (roomId) {
      // Already connected to room
      room = roomManager.get(roomId);
    } else {
      if (roomManager.existsCode(roomCode)) {
        // Get existing room
        room  = roomManager.getByCode(roomCode);
      } else {
        // Create room
        room = roomManager.make(roomData);
      }
      connection.setRoomId(room.getId());
      connection.setType(Connection.TYPE_REGISTER);
    }

    // Set context
    req.set('room', room);
    //connection.emit('room', room.serialize());

    //---------------------------------
    this.next(req, res);
  }
}
