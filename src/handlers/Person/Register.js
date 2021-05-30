const SocketHandler = require('../../lib/ActionHandler');
      
// ==============================================================
// Register Person
// ==============================================================
module.exports = class extends SocketHandler {
  execute(eventKey, req, res) {

    const connection = req.getConnection();
    const app = connection.getApp();
    const personManager = app.getManager('person');
    const socket = connection.getSocket();
    const name = req.getPayload();
    //---------------------------------
    let person;
    let personId = connection.getPersonId();
    if (personManager.isValidId(personId)) {
      person = personManager.get(personId);
    } else {
      person = personManager.make();
    }

    personId = person.getId();
    person.setName(name);
    personManager.store(person);
    connection.setPersonId(personId);

    let serialized = person.serialize();
    socket.emit('me', serialized);

    //---------------------------------
    this.next(eventKey, req, res);
  }
}
