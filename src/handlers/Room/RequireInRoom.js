const SocketHandler = require('../../lib/ActionHandler');

/**
 * Require Room
 * 
 * Will require that the current socket is 
 *  connected to a room to continue executing handlers.
 */
module.exports = class extends SocketHandler {
  execute(eventKey, req, res) {
    const connection = req.getConnection();
    const app = connection.getApp();
    const roomManager = app.getManager('room');
    //---------------------------------

    // If connection is registered to a room 
    // disconnect from room
    let room = connection.getRoom();
    if (room) {
      // Set context
      req.set('roomId', room.getId());
      req.set('room', room);
      req.set('roomManager', roomManager);

      // Execute next handler
      this.next(eventKey, req, res);
      return;
    }

    // else failure
    res.setIsFailure(true);
  }
}
