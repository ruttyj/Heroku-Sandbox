const SocketHandler = require('../../lib/ActionHandler');

// ==============================================================
// Current Room
// ==============================================================
module.exports = class extends SocketHandler {
  execute(eventKey, req, res) {
    const connection = req.getConnection();
    const app = connection.getApp();
    const socket = connection.getSocket();
    
    //---------------------------------
    const room = req.get('room');
    if (room) {
      socket.emit('room', room.serialize());
    } else {
      socket.emit('room', null);
    }

    //---------------------------------
    this.next(eventKey, req, res);
  }
}
