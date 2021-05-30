const SocketHandler = require('../../lib/ActionHandler');


// ==============================================================
// List People in Room
// ==============================================================
module.exports = class extends SocketHandler {
  execute(eventKey, req, res) {
    const connection = req.getConnection();
    const app = connection.getApp();
    const socket = connection.getSocket();
    // get from context
    const roomManager = req.get('roomManager');
    const roomId = req.get('roomId');
    const room = req.get('room');
    //---------------------------------

    


    // Exxecute next handler
    this.next(eventKey, req, res);
  }
}