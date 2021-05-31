const SocketHandler = require('../../lib/ActionHandler');

/**
 * Get room Context from prop
 * Provide the room context to subsequent handlers
 * given the room id
 */
module.exports = class extends SocketHandler {
  execute(eventKey, req, res) {
    const connection = req.getConnection();
    const app = connection.getApp();
    const roomManager = app.getManager('room');
    const value = req.getPayload();
    //---------------------------------

    // get the room id from the payload
    const roomId = value;
    const room = roomManager.get(roomId);
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
