const SocketHandler = require('../../lib/ActionHandler');
      
// ==============================================================
// Connection type 
// ==============================================================
module.exports = class ConnectionGetTypeHandler extends SocketHandler {
  execute(eventKey, req, res) {
    const connection = req.getConnection();
    const socket = connection.getSocket();
    socket.emit('connection_type', connection.getType());

    this.next(eventKey, req, res);
  }
}