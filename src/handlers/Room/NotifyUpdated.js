const SocketHandler = require('../../lib/ActionHandler');

// ==============================================================
// Notify Room Updated
// ==============================================================
module.exports = class extends SocketHandler {
  execute(eventKey, req, res) {
    const room = req.get('room');
    //---------------------------------

    // Notify everyone subscribed to this room
    //  For now that is only the people in that room
    let roomSerialized = room.serialize();
    room.getEveryone().forEach((person) => {
      let personConnection = person.getConnection();
      personConnection.emit('room', roomSerialized);
    });

    //---------------------------------
    this.next(eventKey, req, res);
  }
}
