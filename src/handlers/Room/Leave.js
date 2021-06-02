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
    const room = req.get('room');
    //---------------------------------

    console.log('leave_room');
    
    // Remove connnection association to room   
    connection.setRoomId(null);
    connection.setType('lobby');

    // Remove person
    const personId = req.get('personId');
    room.removePerson(personId);

    // Notify of leave room
    socket.emit('room', null);
    socket.emit('leave_room', true);
    eventRegistry.execute('get_connection', connection);

    //---------------------------------
    // Exxecute next handler
    this.next(eventKey, req, res);
  }
}
