const SocketRegistry = require('../lib/Registry');
const socketRegistry = new SocketRegistry();

const ExecuteMultiple = require('../handlers/ExecuteMultiple');

// Debug  =======================================================
const Log                         = require('../handlers/Debug/Log');
const GetConnection               = require('../handlers/Connection/Get');
const JoinRoom                    = require('../handlers/Room/Join');
const RequireNotConnectedToRoom   = require('../handlers/Room/RequiredNotConnectedToRoom');
const RequireUnregistered         = require('../handlers/Room/Person/RequireUnregistered');
const RegisterInRoom              = require('../handlers/Room/Person/Register');
const RequireRegistered           = require('../handlers/Room/Person/RequireRegistered');
const GetMe                       = require('../handlers/Room/Person/GetMe');
const RequireConnectedToRoom      = require('../handlers/Room/RequireConnectedToRoom');
const NotifyRoomOfAllPeople       = require('../handlers/Room/NotifyRoomOfAllPeople');
const LeaveRoom                   = require('../handlers/Room/Leave');
const requireRegisteredInRoom     = (next=null) => (new RequireConnectedToRoom(new RequireRegistered(next)));
const Message                     = require('../handlers/Room/Chat/Message');
const GetChatTranscript           = require('../handlers/Room/Chat/Transcript');
const ChangeMyName                = require('../handlers/Room/Person/ChangeMyName');

socketRegistry.public('get_connection',                 (new GetConnection()));
socketRegistry.public('join_room',                      (new RequireNotConnectedToRoom(new JoinRoom(new GetConnection()))));
socketRegistry.public('register_in_room',               (new RequireConnectedToRoom(new RequireUnregistered(new RegisterInRoom(new GetConnection(new GetMe(new NotifyRoomOfAllPeople(new GetChatTranscript()))))))));
socketRegistry.public('leave_room',                     (requireRegisteredInRoom(new LeaveRoom(new NotifyRoomOfAllPeople()))));
socketRegistry.public('disconnect',                     (new ExecuteMultiple(['leave_room'])));
socketRegistry.public('message',                        new Log(requireRegisteredInRoom(new Message())));
socketRegistry.public('change_my_name',                 new Log(requireRegisteredInRoom(new ChangeMyName(new NotifyRoomOfAllPeople()))));



module.exports = socketRegistry;
/*



// Connection type  =============================================
socketRegistry.public('get_connection',                     new GetConnection());
socketRegistry.public('get_connection_type',                new GetConnectionType());
socketRegistry.public('set_connection_type',                new SetConnectionType());
socketRegistry.public('disconnect',                         new ExecuteMultiple(['unregister_person', 'room_disconnect'])); 

// Rooms ========================================================
socketRegistry.private('notify_room_people_all_keyed',      new ContextFromRoomId(new NotifyEveryoneInRoomOfAllPeople()));
socketRegistry.private('notify_room_updated',               new ContextFromRoomId(new NotifyUpdatedRoom()));
socketRegistry.public('get_current_room',                   new RequireRoomConnection(new GetCurrentRoom(new GetPeopleInRoom())));
socketRegistry.public('get_room_list',                      new ListRooms());
socketRegistry.public('join_room',                          new Log(new JoinRoom(requireRegisteredInRoom(new NotifyEveryoneInRoomOfAllPeople(new GetChatTranscript())))));
socketRegistry.public('leave_room',                         requireRegisteredInRoom(new LeaveRoom(new RemovePersonFromRoom(new Unregister(new NotifyEveryoneInRoomOfAllPeople())))));
socketRegistry.public('room_disconnect',                    requireRegisteredInRoom(new LeaveRoom(new RemovePersonFromRoom(new NotifyEveryoneInRoomOfAllPeople()))));

// Person =======================================================
socketRegistry.public('register_person',                    new Log(new RequireRoomConnection(new RegisterPersonInRoom())));
socketRegistry.public('change_my_name',                     new Log(requireRegisteredInRoom(new ChangeMyName(new NotifyEveryoneInRoomOfAllPeople()))))

// Chat =========================================================
socketRegistry.public('message',                            requireRegisteredInRoom(new SendMessage()));
socketRegistry.public('typing',                             requireRegisteredInRoom(new NotifyIsTyping()));
socketRegistry.public('get_chat_transcript',                requireRegisteredInRoom(new GetChatTranscript()));


*/

/**
 * Join room 
 *  add room to connection
 *  add person to person list
 *  emit to everyone the new person list 
 * 
 * leave room
 *  require in a room
 *    remove from current connection
 *    remove person from room
 *    emit to every on in room new person list
 * 
 *  
 * 
 * 
 * */
