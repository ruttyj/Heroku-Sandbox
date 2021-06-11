const SocketHandler = require('../../lib/ActionHandler');
      
// ==============================================================
// Unegister Person
// ==============================================================
module.exports = class extends SocketHandler {
  execute(eventKey, req, res) {
    const connection = req.getConnection();
    const socket = connection.getSocket();
    const personId = req.get('myPersonId');
    const personManager = req.get('personManager');
    //---------------------------------

    console.log('Unregister');
   
    personManager.remove(personId);
    connection.setPersonId(null);

    socket.emit('me', null);
    socket.emit('connection', connection.serialize());

    //---------------------------------
    this.next(eventKey, req, res);
  }
}
