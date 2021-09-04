const ProtectedHandler = require('../../lib/ProtectedHandler');
const Person  = require('../../models/Person');
const connectionController = require('../Connection/Connection');
const roomController = require('../Room/Room');
const Connection = require('../../models/Connection');

const personController = {
  ////////////////////////////////////////
  // REQUIRED REGISTERED
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


  requireIsHost: () => new (class extends ProtectedHandler {
    require() 
    {
      return [
        personController.requireRegistered(),
      ]
    }
    run(req, res, next)
    {
      const me = req.get('person');
      if (me.hasTag(Person.TYPE_HOST)) {
        next(req, res);
      }
    }
  })(),


  ////////////////////////////////////////
  // SEND EVERYONE IN ROOM TO EVERYONE
  notifyRoomOfAllPeople: () => new (class extends ProtectedHandler {
    require() 
    {
      console.log('roomController', roomController);
      return [
        roomController.requireConnected(),
      ]
    }
    run(req, res, next)
    {
      // get from context
      const room = req.get('room');
      const con = req.getConnection();
      const person = req.get('person');
      const personId = person.getId();
      //---------------------------------

      // Get people in the room
      let people = room.getPeople();

      // If im not in the list whipe my people list
      if (!people.has(personId)) {
        con.emit('room_people_all_keyed', {
          items: {},
          order: [],
        });
      } 

      // update everyone who is in the room
      room.emitToEveryone('room_people_all_keyed', people.serialize());
      //---------------------------------
      // Exxecute next handler
      next(req, res);
    }
  })(),


  ////////////////////////////////////////
  // CHANGE MY NAME
  changeMyName: () => new (class extends ProtectedHandler {
    require() 
    {
      return [
        personController.requireRegistered(),
      ]
    }
    run(req, res, next)
    {
      const me = req.get('person');
      const newName = req.getPayload();
      //------------------------------------------

      me.setName(String(newName));
      personController.notifyRoomOfAllPeople().execute(req, res);
    }
  })(),

  ////////////////////////////////////////
  // SET HOST
  setHost: () => new (class extends ProtectedHandler {
    require() 
    {
      return [
        personController.requireIsHost(),
      ]
    }
    run(req, res, next)
    {
      const me = req.get('person');
      const room = req.get('room');
      const newHostId = req.getPayload();
      //------------------------------------------
    
      const people = room.getPeople();
      if (people.has(newHostId)) {
        const newHost = people.get(newHostId);
        newHost.addTag(Person.TYPE_HOST);
        me.removeTag(Person.TYPE_HOST);
    
        personController.notifyRoomOfAllPeople().execute(req, res);
      }
    }
  })(),


  ////////////////////////////////////////
  // TOGGLE READY
  toggleReady: () => new (class extends ProtectedHandler {
    require() 
    {
      return [
        personController.requireRegistered(),
      ]
    }
    run(req, res, next)
    {
      const me = req.get('person');
    
      //---------------------------------
      if (me.hasTag(Person.IS_READY)) {
        me.removeTag(Person.IS_READY);
      } else {
        me.addTag(Person.IS_READY);
      }
  

      personController.notifyRoomOfAllPeople().execute(req, res);

      //---------------------------------
      // Exxecute next handler
      next(req, res);
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
      personController.notifyRoomOfAllPeople().execute(req, res);
      connectionController.get().execute(req, res);
      roomController.get().execute(req, res);
      //---------------------------------
      next(req, res);
    }
  })(),


  ////////////////////////////////////////
  // LEAVE
  leave: () => new (class extends ProtectedHandler { 
    require() {
      return [
        personController.requireRegistered(),
      ]
    }
    run(req, res, next) {
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

      personController.notifyRoomOfAllPeople().execute(req, res);
      next(req, res);
    }
  })(),
}

module.exports = personController;