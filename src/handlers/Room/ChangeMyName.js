const SocketHandler = require('../../lib/ActionHandler');

module.exports = class extends SocketHandler {
  execute(eventKey, req, res) {
    const connection = req.getConnection();
    const app = connection.getApp();
    const socket = connection.getSocket();
    const personManager = app.getManager('person');
    const socketHandlers = app.getRegistry('socket');
    const name = req.getPayload();
    let person = req.get('me', false);
    //---------------------------------
   
    person.setName(name);
    personManager.store(person);
    socket.emit('me', person.serialize());

    //---------------------------------
    this.next(eventKey, req, res);
  }
}
