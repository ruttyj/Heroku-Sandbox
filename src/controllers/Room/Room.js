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

  requireRegistered: () => new (class extends ProtectedHandler {
    require() 
    {
      return [
        roomController.requireConnected(),
      ]
    }
    run(req, res, next)
    {
      console.log('requireRegistered');
      const con = req.getConnection();
      const room = req.get('room');
      const people = room.getPeople();
      const personId = con.getPersonId();
      if (personId) {
        const person = people.get(personId);
        req.set('person', person);
        next(req, res);
      }
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

  ////////////////////////////////////////
  // REGISTER
  register: () => new (class extends ProtectedHandler {
    require()
    {
      return [
        roomController.requireUnregistered(),
      ]
    }
    run(req, res, next) {
     
      const room = req.get('room');
      const con = req.getConnection();
      const personName = req.getPayload();
      //---------------------------------

      // Create person
      const person = new Person({
        name: personName,
      });
      person.addTag(Person.TYPE_MEMBER);
      person.addTag(Person.STATUS_CONNECTED);

      room.addPerson(person);

      person.connect(con);

      // Assign host if none exists
      room.hasOrAutoAssignHost();

      con.emit('me', person.getId());
      con.setType(Connection.TYPE_IN_ROOM);

      // Set person context for following handlers
      req.set('person', person);

      //---------------------------------
      // Exxecute next handler
      (new NotifyRoomOfAllPeople()).execute(req, res);
      connectionController.get().execute(req, res);
      roomController.get().execute(req, res);
      //---------------------------------
      next(req, res);
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
        roomController.requireRegistered(),
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
        roomController.requireRegistered(),
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

      // Leave room
      con.setRoomId(null);
      con.setPersonId(null);
      con.setType(Connection.TYPE_PICK_ROOM);

      //------------------------------------------
      // now that I have left the rooom

      // update connection
      con.setType(Connection.TYPE_PICK_ROOM);
      connectionController.get().execute(req, res);

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

module.exports = roomController;