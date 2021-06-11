const SocketHandler = require('../../lib/ActionHandler');


// ==============================================================
// Leave Room
// ==============================================================
module.exports = class extends SocketHandler {
  execute(eventKey, req, res) {
    const connection = req.getConnection();
    const socket = connection.getSocket();
    const room = req.get('room');
    //---------------------------------

    console.log('leave_room');
    
    // Remove connnection association to room   
    connection.setRoomId(null);
    connection.setType('lobby');

    // Remove person
    const person = req.get('person');
    const personId = person.getId();
    person.disconnect();
    room.removePerson(personId);

    // Notify of leave room
    socket.emit('room', null);
    socket.emit('me', null);
    socket.emit('leave_room', true);

    //---------------------------------
    // Exxecute next handler
    this.next(eventKey, req, res);
  }
}
