const SocketHandler = require('../../lib/ActionHandler');

module.exports = class extends SocketHandler {
  execute(eventKey, req, res) {
    const con = req.getConnection();
    const room = req.get('room');
    //---------------------------------
    
    if (room) {
      con.emit('room', room.serialize());
    } else {
      con.emit('room', null);
    }

    //---------------------------------
    // Exxecute next handler
    this.next(eventKey, req, res);
  }
}
