const Room = require('../../models/Room');
const Connection = require('../../models/Connection');
const SocketHandler = require('../../lib/ActionHandler');
const HandlerFunc = require('../../handlers/Callback');
const ProtectedHandler = require('../../lib/ProtectedHandler');
const NotifyRoomOfAllPeople = require('../../handlers/Room/Person/NotifyRoomOfAllPeople');
const RequireConnectedToRoom = require('../../handlers/Room/RequireConnected');
const RequireRegistered = require('../../handlers/Room/Person/RequireRegistered');
const LeaveRoom = require('../../handlers/Room/Leave');
const GetConnection = require('../../handlers/Connection/Get');

const controller = {
  /*
  // Template
  handlerName: () => new (class extends ProtectedHandler {
    require() 
    {
    }
    run()
    {
    }
  })(),
  //*/


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

  requireRegistered: () => new (class extends ProtectedHandler {
    require() 
    {
      return [
        controller.requireConnected(),
      ]
    }
    run(req, res, next)
    {
      console.log('requireRegistered');
      const connection = req.getConnection();
      const room = req.get('room');
      const people = room.getPeople();
      const personId = connection.getPersonId();
      if (personId) {
        const person = people.get(personId);
        req.set('person', person);
        next(req, res);
      }
    }
  })(),


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

  ////////////////////////////////////////
  // TEST
  test: () => new (class extends ProtectedHandler {
    require() {
      return [
        new HandlerFunc((req, res, next) => {
          req.set('message', 'hello world');
          next(req, res);
        }),
        new HandlerFunc((req, res, next) => {
          req.set('message2', 'hello world2');
          next(req, res);
        }),
        new HandlerFunc((req, res, next) => {
          req.set('message3', 'hello world3');
          next(req, res);
        }),
        controller.requireRegistered(),
      ]
    }
    run(req, res, next) {
      console.log('doTheThing', '@@@@@@@@@@@@@@@@@@@@@@@@@@', req.get('message'),  req.get('message2'), req.get('message3'));
      next(req, res);
    }
  })(),

  ////////////////////////////////////////
  // LEAVE
  leave: () => new (class extends ProtectedHandler { 
    require() {
      return [
        controller.requireRegistered(),
      ]
    }
    run(req, res, next) {
      console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
      const con = req.getConnection();
      const person = req.get('person');
      const room = req.get('room');
      const app = con.getApp();
      const roomManager = app.getManager('room');
      //------------------------------------------
      // Remove person from room
      room.getPeople().remove(person.getId());
      con.emit('me', null);

      console.log('before leave');
      // Leave room
      con.setRoomId(null);
      con.setPersonId(null);
      con.setType(Connection.TYPE_PICK_ROOM);

      // now that I have left the rooom

      console.log('after leave');

      // update connection
      con.setType(Connection.TYPE_PICK_ROOM);
      (new GetConnection()).execute(req, res);

      // Assign another host if nessary
      const hasHost = room.hasOrAutoAssignHost();
      if (!hasHost) {
        // destroy room
        room.destroy();
        roomManager.remove(room.getId());
      }

      con.emit('room', null);

      (new NotifyRoomOfAllPeople()).execute(req, res);
      next(req, res);
    }
  })(),
}

module.exports = controller;