const Room = require('../../models/Room');
const Connection = require('../../models/Connection');
const SocketHandler = require('../../lib/ActionHandler');
const requirePersonInRoom = require('../../handlers/requirePersonInRoom');
const Callback = require('../../handlers/Callback');
const ProtectedHandler = require('../../lib/ProtectedHandler');
const NotifyRoomOfAllPeople = require('../../handlers/Room/Person/NotifyRoomOfAllPeople');

const LeaveRoom = require('../../handlers/Room/Leave');

const controller = {
  ////////////////////////////////////////
  // JOIN ROOM
  join: () => new (class extends SocketHandler {
    execute(req, res) {
      const connection = req.getConnection();
      const app = connection.getApp();
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
      let roomId = connection.getRoomId();
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
        connection.setRoomId(room.getId());
        connection.setType(Connection.TYPE_REGISTER);
      }

      // Set context
      req.set('room', room);
      //connection.emit('room', room.serialize());

      //---------------------------------
      this.next(req, res);
    }
  })(), 

  test: () => new (class extends ProtectedHandler {
    require() {
      return [
        new Callback((req, res, next) => {
          req.set('message', 'hello world');
          next(req, res);
        }),
        new Callback((req, res, next) => {
          req.set('message2', 'hello world2');
          next(req, res);
        }),
        new Callback((req, res, next) => {
          req.set('message3', 'hello world3');
          next(req, res);
        }),
      ]
    }
    run(req, res, next) {
      console.log('doTheThing', '@@@@@@@@@@@@@@@@@@@@@@@@@@', req.get('message'),  req.get('message2'), req.get('message3'));
      next(req, res);
    }
  })(),


  leave: () => new (class extends ProtectedHandler { 
    require() {
      return [
        requirePersonInRoom(),
      ]
    }
    run(req, res, next) {
      
      next(req, res);
    }
  })(),
}

module.exports = controller;