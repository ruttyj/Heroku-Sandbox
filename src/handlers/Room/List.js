const SocketHandler = require('../../lib/ActionHandler');
const RoomModel = require('../../models/mongodb/Room/Model');
      
// ==============================================================
// Get Room
// ==============================================================
module.exports = class extends SocketHandler {
  execute(eventKey, req, res) {
    const connection = req.getConnection();
    const app = connection.getApp();
    const roomManager = app.getManager('room');
    const socket = connection.getSocket();
    //---------------------------------

    let rooms = roomManager.list();
    socket.emit('room_list', {
      status: "success",
      data: rooms
    });

    //---------------------------------
    this.next(eventKey, req, res);
  }
}
