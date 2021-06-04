const SocketHandler = require('../../../lib/ActionHandler');

// ==============================================================
// Remove person from room
// ==============================================================
module.exports = class extends SocketHandler {
  execute(eventKey, req, res) {
    const connection = req.getConnection();
    const room = req.get('room');
    //---------------------------------
    console.log('remove person');

    // Remove person
    const personId = req.get('personId');
    room.removePerson(personId);

    //---------------------------------
    // Exxecute next handler
    this.next(eventKey, req, res);
  }
}
