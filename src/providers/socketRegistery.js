const SocketRegistry = require('../lib/Registry');
const socketRegistry = new SocketRegistry();

const ExecuteMultiple = require('../handlers/ExecuteMultiple');




// Debug  =======================================================
const Log = require('../handlers/Debug/Log');

// Connection type  =============================================
const GetConnection                                       = require('../handlers/Connection/Get');
const GetConnectionType                                   = require('../handlers/Connection/GetType');
const SetConnectionType                                   = require('../handlers/Connection/SetType');

// Person =======================================================
const RequireRegistered                                   = require('../handlers/Person/RequireRegistered');
const Unregister                                          = require('../handlers/Person/Unregister');
const ChangeMyName                                        = require('../handlers/Room/ChangeMyName');

// Rooms ========================================================
const ContextFromRoomId                                   = require('../handlers/Room/ContextFromId');
const RequireRoomConnection                               = require('../handlers/Room/RequireConnectedToRoom');
const requireRegisteredInRoom                             = (next=null) => new RequireRoomConnection(new RequireRegistered(next));
const NotifyUpdatedRoom                                   = require('../handlers/Room/NotifyUpdated'); // let everyone in the room know the object changed
const NotifyEveryoneInRoomOfAllPeople                     = require('../handlers/Room/NotifyRoomOfAllPeople');
const GetPeopleInRoom                                     = require('../handlers/Room/GetPeopleInRoom');
const JoinRoom                                            = require('../handlers/Room/Join');
const GetCurrentRoom                                      = require('../handlers/Room/Current');
const ListRooms                                           = require('../handlers/Room/List');
const LeaveRoom                                           = require('../handlers/Room/Leave');
const RegisterPersonInRoom                                = require('../handlers/Room/RegisterPerson');
const RemovePersonFromRoom                                = require('../handlers/Room/Person/Remove');

// Chat =========================================================
const SendMessage                                         = require('../handlers/Room/Chat/Message');
const NotifyIsTyping                                      = require('../handlers/Room/Chat/Typing');
const GetChatTranscript                                   = require('../handlers/Room/Chat/Transcript');





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





module.exports = socketRegistry;




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
