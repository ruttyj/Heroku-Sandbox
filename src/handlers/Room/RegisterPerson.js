const SocketHandler = require('../../lib/ActionHandler');

// ==============================================================
// Join Room
// ==============================================================
module.exports = class extends SocketHandler {
  execute(eventKey, req, res) {
    const connection = req.getConnection();
    const app = connection.getApp();
    const socket = connection.getSocket();
    const personManager = app.getManager('person');
    const socketHandlers = app.getRegistry('socket');
    const name = req.getPayload();
    const room = req.get('room');
    let person = req.get('me', false);
    //---------------------------------
    if (!person) {
      person = personManager.make({
        name: name,
      });
      person.connect(connection);
      socket.emit('me', person.serialize());
    }

    // addPerson
    if (person) {
      room.addPerson(person);
      connection.setType('room');
      connection.setRoomId(room.getId());
    }

    //---------------------------------
    this.next(eventKey, req, res);
  }
}
