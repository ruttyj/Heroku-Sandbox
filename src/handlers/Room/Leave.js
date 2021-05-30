const SocketHandler = require('../../lib/ActionHandler');


// ==============================================================
// Leave Room
// ==============================================================
module.exports = class extends SocketHandler {
  execute(eventKey, req, res) {
    const connection = req.getConnection();
    const app = connection.getApp();
    const socket = connection.getSocket();
    const eventRegistry = app.getRegistry('socket');
    //---------------------------------
    connection.setRoomId(null);
    connection.setType('lobby');

    // @TODO
    // If room is empty destroy room
    // roomManager

    // Notify of leave room
    socket.emit('room', null);
    eventRegistry.execute('get_connection', connection);
    socket.emit('leave_room', true);

    // Notify of room destruction
    // @TODO
    

    // Exxecute next handler
    this.next(eventKey, req, res);
  }
}
