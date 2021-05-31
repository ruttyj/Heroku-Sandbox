const SocketHandler = require('../../../lib/ActionHandler');

// ==============================================================
// Join Room
// ==============================================================
module.exports = class extends SocketHandler {
  execute(eventKey, req, res) {
    const connection = req.getConnection();
    const app = connection.getApp();
    const socket = connection.getSocket();
    const roomManager = app.req('roomManager');
    const room = app.req('room');
    const me = req.get('me');
    const value = req.getPayload();
    //---------------------------------

    


    //---------------------------------
    this.next(eventKey, req, res);
  }
}
