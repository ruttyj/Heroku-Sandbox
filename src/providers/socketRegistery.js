const SocketRegistry = require('../lib/Registry');
const socketRegistry = new SocketRegistry();
      
// Connection type  =============================================
const GetConnection                         = require('../handlers/Connection/Get');
const GetConnectionType                     = require('../handlers/Connection/GetType');
const SetConnectionType                     = require('../handlers/Connection/SetType');
socketRegistry.public('get_connection',       new GetConnection());
socketRegistry.public('get_connection_type',  new GetConnectionType());
socketRegistry.public('set_connection_type',  new SetConnectionType());

// Person =======================================================
const RegisterPerson                        = require('../handlers/Person/Register');
const RequireRegistered                     = require('../handlers/Person/RequireRegistered');
const UnregisterPerson                      = require('../handlers/Person/Unregister');
socketRegistry.public('register_person',      new RegisterPerson());
socketRegistry.public('unregister_person',    new RequireRegistered(new UnregisterPerson()));

// Rooms ========================================================
const ContextFromRoomId                             = require('../handlers/Room/ContextFromId');
const RequireConnectedToRoom                        = require('../handlers/Room/RequireConnectedToRoom');
const NotifyUpdatedRoom                             = require('../handlers/Room/NotifyUpdated'); // let everyone in the room know the object changed
const JoinRoom                                      = require('../handlers/Room/Join');
const GetCurrentRoom                                = require('../handlers/Room/Current');
const ListRooms                                     = require('../handlers/Room/List');
const LeaveRoom                                     = require('../handlers/Room/Leave');
const ListPeopleInRoom                              = require('../handlers/Room/ListPeople');
socketRegistry.public('join_room',                    new JoinRoom());
socketRegistry.private('notify_room_updated',         new ContextFromRoomId(new NotifyUpdatedRoom())); // accepts roomId as the payload
socketRegistry.public('get_current_room',             new RequireConnectedToRoom(new GetCurrentRoom()));
socketRegistry.public('get_room_list',                new ListRooms());
socketRegistry.public('leave_room',                   new RequireConnectedToRoom(new LeaveRoom()));
socketRegistry.public('get_room_people_all_keyed',    new RequireConnectedToRoom(new ListPeopleInRoom()));

// Chat =========================================================
const SendMessage           = require('../handlers/Room/Chat/Message');
socketRegistry.public('message',  new RequireConnectedToRoom(new RequireRegistered(new SendMessage())));


module.exports = socketRegistry;
