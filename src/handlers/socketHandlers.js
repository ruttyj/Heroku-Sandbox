const SocketRegistry = require('../lib/Registry');
const handlers = new SocketRegistry();
const Connection = require('../models/Connection');
const Person = require('../models/Person')

const ExecuteMultiple = require('../handlers/ExecuteMultiple');
const Callback = require('../handlers/Callback');

// Debug  =======================================================
const Log = require('../handlers/Debug/Log');

// Connection  ==================================================
const GetConnection = require('../handlers/Connection/Get');

// Room  ========================================================
const RequireNotConnectedToRoom = require('../handlers/Room/RequireNotConnected');
const RequireConnectedToRoom = require('../handlers/Room/RequireConnected');
const JoinRoom = require('../handlers/Room/Join');
const GetRoom = require('../handlers/Room/Get');
const LeaveRoom = require('../handlers/Room/Leave');

// Person  ======================================================
const RequireUnregistered = require('../handlers/Room/Person/RequireUnregistered');
const RequireRegistered = require('../handlers/Room/Person/RequireRegistered');
const RegisterInRoom = require('../handlers/Room/Person/Register');
const NotifyRoomOfAllPeople = require('../handlers/Room/Person/NotifyRoomOfAllPeople');
const NotifyRoomOfUpdate = require('../handlers/Room/NotifyRoomOfUpdate');
const IsHost = require('../handlers/Room/Person/IsHost');
const requirePersonInRoom = (next = null) => new RequireConnectedToRoom(new RequireRegistered(next));

const ToggleReadyUp = require('../handlers/Room/Person/ToggleReadyUp');
// Chat =========================================================
const Message = require('../handlers/Room/Chat/Message');



const roomController = require('../controllers/Room/Room')

// Game =========================================================
const StartGame = require('../handlers/Room/Game/Start');





// Connection  ==================================================
handlers.public('get_connection', (new GetConnection()));
handlers.public('disconnect', new Callback(((req, res) => {
  const con = req.getConnection();
  const app = con.getApp();
  const handlers = app.getHandlers('socket');
  //------------------------------------------

  handlers.execute('leave_room', con);
})));

// Room  ========================================================
handlers.public('join_room', new roomController.join());
handlers.private('get_room', (new RequireConnectedToRoom((...props) => {
  (new GetRoom()).execute(...props);

})));


handlers.public('leave_room', (requirePersonInRoom((req, res) => {
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
  (new LeaveRoom((req, res) => {
    // now that I have left the rooom

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
  })).execute(req, res);
})));

// Person  ======================================================
handlers.public('register_in_room', (new RequireConnectedToRoom(new RequireUnregistered(new RegisterInRoom((req, res) => {
  //------------------------------------------
  (new NotifyRoomOfAllPeople()).execute(req, res);
  (new GetConnection()).execute(req, res);
  (new GetRoom()).execute(req, res);
})))));

handlers.public('change_my_name', ((requirePersonInRoom((req, res) => {
  const me = req.get('person');
  const newName = req.getPayload();
  //------------------------------------------

  me.setName(String(newName));
  (new NotifyRoomOfAllPeople()).execute(req, res);
}))))

handlers.public('set_host', ((new IsHost((req, res) => {
  const me = req.get('person');
  const room = req.get('room');
  const newHostId = req.getPayload();
  //------------------------------------------

  const people = room.getPeople();
  if (people.has(newHostId)) {
    const newHost = people.get(newHostId);
    newHost.addTag(Person.TYPE_HOST);
    me.removeTag(Person.TYPE_HOST);

    (new NotifyRoomOfAllPeople()).execute(req, res);
  }
}))));

handlers.public('toggle_ready', requirePersonInRoom((req, res) => {
  (new ToggleReadyUp(new NotifyRoomOfAllPeople())).execute(req, res);
}));


handlers.public('change_room_config', new IsHost((req, res) => {
  const payload = req.getPayload();
  const room = req.get('room');
  //------------------------------------------
  try {
    const key = payload.key;
    const value = payload.value;

    const roomConfigs = room.getConfig();
    if (roomConfigs.hasField(key)) {
      roomConfigs.updateField(key, value);

      (new NotifyRoomOfUpdate()).execute(req, res);
    }
  } catch (e) {
    console.log(e);
  }
}));

// Chat =========================================================
handlers.public('message', requirePersonInRoom(new Message()));


handlers.public('start_game', new StartGame());





module.exports = handlers;
