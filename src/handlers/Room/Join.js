const SocketHandler = require('../../lib/ActionHandler');

// ==============================================================
// Join Room
// ==============================================================
module.exports = class extends SocketHandler {
  execute(eventKey, req, res) {
    const connection = req.getConnection();
    const app = connection.getApp();
    const socket = connection.getSocket();
    const socketHandlers = app.getRegistry('socket');
    const roomManager = app.getManager('room');
    const value = req.getPayload();

    //---------------------------------

    let roomCode = value;
    let roomTitle = roomCode;

    // Create room data
    const roomData = {
      code: roomCode,
      title: roomTitle,
      playerCount: 0,
      joinable: true,
      mode: "in_setup",
      state: "{}",
    }

    let room;
    let roomId = connection.getRoomId();
    if (roomId) {
      room = roomManager.get(roomId);
    } else {
      if (roomManager.existsCode(roomCode)) {
        room  = roomManager.getByCode(roomCode);
      } else {
        room = roomManager.make(roomData);
      }
      connection.setRoomId(room.getId());
      connection.setType('room');
    }
    req.set('roomId', roomId);
    req.set('room', room);
    
    connection.emit('room', room.serialize());


    //---------------------------------
    this.next(eventKey, req, res);
  }
}
