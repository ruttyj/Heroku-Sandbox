const SocketHandler = require('../../lib/ActionHandler');

// ==============================================================
// List People in Room
// ==============================================================
module.exports = class extends SocketHandler {
  execute(req, res) {
    // get from context
    const room = req.get('room');
    const myConnection = req.getConnection();
    const person = req.get('person');
    const personId = person.getId();
    //---------------------------------
    // update everyone who is in the room
    room.emitToEveryone('room', room.serialize());
    //---------------------------------
    // Exxecute next handler
    this.next(req, res);
  }
}