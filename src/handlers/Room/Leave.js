const SocketHandler = require('../../lib/ActionHandler');
const Connection = require('../../models/Connection');
module.exports = class extends SocketHandler
{
  execute(req, res)
  {
    const con = req.getConnection();
    const socket = con.getSocket();
    //---------------------------------
    console.log('leave_room');
    
    // Remove connnection association to room   
    con.setRoomId(null);
    con.setType(Connection.TYPE_PICK_ROOM);

    //---------------------------------
    // Exxecute next handler
    this.next(req, res);
  }

  finish(req, res)
  {
    const con = req.getConnection();
    const socket = con.getSocket();
    //---------------------------------
    socket.emit('leave_room', true);
  }
}
