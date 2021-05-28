const SocketHandler = require('../../lib/ActionHandler');
const RoomModel = require('../../models/mongodb/Room/Model');
      
// ==============================================================
// Get Room
// ==============================================================
module.exports = class extends SocketHandler {
  execute(eventKey, req, res) {
    const connection = req.getConnection();
    const socket = connection.getSocket();
    const value = req.getPayload();
    //---------------------------------
    RoomModel.find({})
      .then((data) => {
        socket.emit('room_list', {
          status: "success",
          data: data
        });
      })
      .catch((error) => {
        console.log('error:', error)
      });
    //---------------------------------
    this.next(eventKey, req, res);
  }
}
