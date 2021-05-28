const SocketHandler = require('../../lib/ActionHandler');
      
// ==============================================================
// Get Connection Type
// ==============================================================
module.exports = class ConnectionGetTypeHandler extends SocketHandler {
  execute(eventKey, req, res) {
    const connection = req.getConnection();
    const socket = connection.getSocket();
    //---------------------------------

    socket.emit('connection_type', connection.getType());

    //---------------------------------
    this.next(eventKey, req, res);
  }
}
