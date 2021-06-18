const SocketHandler = require('../../lib/ActionHandler');

module.exports = class extends SocketHandler {
  execute(req, res) {
    const connection = req.getConnection();
    const app = connection.getApp();
    const roomManager = app.getManager('room');
    //---------------------------------

    // If connection is registered to a room 
    // disconnect from room
    let room = connection.getRoom();
    if (room) {
      // Set context
      req.set('room', room);
      req.set('roomManager', roomManager);

      // Execute next handler
      this.next(req, res);
      return;
    }

    // else failure
    res.setIsFailure(true);
  }
}
