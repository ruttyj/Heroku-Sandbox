const SocketHandler = require('../../lib/ActionHandler');
      
// ==============================================================
// Set Connection Type
// ==============================================================
module.exports = class ConnectionGetTypeHandler extends SocketHandler {
  execute(eventKey, req, res) {
    const connection = req.getConnection();
    const socket = connection.getSocket();
    const value = req.getPayload();
    //---------------------------------

    connection.setType(value);
    socket.emit('connection_type', connection.getType());

    //---------------------------------
    this.next(eventKey, req, res);
  }
}
