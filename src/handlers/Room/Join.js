const SocketHandler = require('../../lib/ActionHandler');
const RoomModel = require('../../models/mongodb/Room/Model');
      
module.exports = class extends SocketHandler {
  execute(eventKey, req, res) {
    const connection = req.getConnection();
    const socket = connection.getSocket();
    const value = req.getPayload();

    let roomCode = value;
    let roomTitle = roomCode;

    // Create room data
    const roomData = {
      code: roomCode,
      title: roomTitle,
      playerCount: 0,
      joinable: true,
      mode: "in_setup",
      state: "{}",
    }

    // Save Model to DB
    const newModel = new RoomModel(roomData);
    const onModelSave = (error) => {
      if (error) {
        connection.setType('room');
        socket.emit('create_room', {
          status: "failure",
          msg: "error"
        });
      } else {
        // let know succeeded to create
        socket.emit('create_room', {
          status: "success",
          msg: "success"
        });

        // sent roomd data to client
        socket.emit('room', roomData);
      }
    }
    newModel.save(onModelSave);

    socket.emit('connection_type', connection.getType());    

    this.next(eventKey, req, res);
  }
}