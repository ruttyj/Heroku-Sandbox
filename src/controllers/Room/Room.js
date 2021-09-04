const Room = require('../../models/Room');
const Connection = require('../../models/Connection');
const SocketHandler = require('../../lib/ActionHandler');
const HandlerFunc = require('../../handlers/Callback');
const ProtectedHandler = require('../../lib/ProtectedHandler');
const NotifyRoomOfAllPeople = require('../../handlers/Room/Person/NotifyRoomOfAllPeople');
const GetConnection = require('../../handlers/Connection/Get');
const connectionController = require('../../controllers/Connection/Connection');
const Person  = require('../../models/Person')
const roomController = {
  ////////////////////////////////////////
  // REQUIRED
  requireConnected: () => new (class extends ProtectedHandler {
    run(req, res, next)
    {
      console.log('requireConnected');

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
        next(req, res);
        return;
      }

      // else failure
      res.setIsFailure(true);
    }
  })(),

  requireUnregistered: () => new (class extends ProtectedHandler {
    require() 
    {
      return [
        roomController.requireConnected(),
      ]
    }
    run(req, res, next)
    {
      const con = req.getConnection();
      const personId = con.getPersonId();
      if (!personId) {
        next(req, res);
      }
    }
  })(),


  ////////////////////////////////////////
  // GET
  get: () => new (class extends ProtectedHandler {
    run(req, res) {
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
      this.next(req, res);
    }
  })(),


  ////////////////////////////////////////
  // JOIN ROOM
  join: () => new (class extends SocketHandler {
    execute(req, res) {
      const con = req.getConnection();
      const app = con.getApp();
      const roomManager = app.getManager('room');
      const roomCode = req.getPayload();
      //---------------------------------
      let roomTitle = roomCode;

      // Create room data
      const roomData = {
        code:         roomCode,
        title:        roomTitle,
        joinable:     true,
        mode:         Room.MODE_SETUP,
      }

      let room;
      let roomId = con.getRoomId();
      if (roomId) {
        // Already connected to room
        room = roomManager.get(roomId);
      } else {
        if (roomManager.existsCode(roomCode)) {
          // Get existing room
          room  = roomManager.getByCode(roomCode);
        } else {
          // Create room
          room = roomManager.make(roomData);
        }
        con.setRoomId(room.getId());
        con.setType(Connection.TYPE_REGISTER);
      }

      // Set context
      req.set('room', room);
      //con.emit('room', room.serialize());

      //---------------------------------
      this.next(req, res);
    }
  })(), 

}

module.exports = roomController;