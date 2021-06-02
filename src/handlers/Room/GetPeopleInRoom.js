const SocketHandler = require('../../lib/ActionHandler');


// ==============================================================
// Get people in room
// ==============================================================
module.exports = class extends SocketHandler {
  execute(eventKey, req, res) {
    // get from context
    const room = req.get('room');
    const connection = req.getConnection();
    //---------------------------------
    
    connection.emit('room_people_all_keyed', room.getPeople().serialize());

    // Exxecute next handler
    this.next(eventKey, req, res);
  }
}