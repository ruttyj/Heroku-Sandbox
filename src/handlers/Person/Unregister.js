const SocketHandler = require('../../lib/ActionHandler');
      
// ==============================================================
// Unegister Person
// ==============================================================
module.exports = class extends SocketHandler {
  execute(eventKey, req, res) {
    const connection = req.getConnection();
    const socket = connection.getSocket();
    const app = connection.getApp();
   
    const personId = req.get('myPersonId');
    const personManager = req.get('personManager');
    personManager.remove(personId);
    connection.setPersonId(null);

    socket.emit('me', null);
    socket.emit('connection', connection.serialize());
    socket.emit('connection_type', connection.getType());

    //---------------------------------
    this.next(eventKey, req, res);
  }
}
