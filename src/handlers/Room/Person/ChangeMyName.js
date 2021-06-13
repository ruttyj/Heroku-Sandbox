const SocketHandler = require('../../../lib/ActionHandler');

module.exports = class extends SocketHandler {
  execute(eventKey, req, res) {
    const connection = req.getConnection();
    const app = connection.getApp();
    const socket = connection.getSocket();
    const personManager = app.getManager('person');
    const name = req.getPayload();
    let person = req.get('person', false);
    //---------------------------------
   
    person.setName(name);
    personManager.store(person);
    
    //execute GetMe
    socket.emit('me', person.serialize());

    //---------------------------------
    this.next(eventKey, req, res);
  }
}
