const SocketRegistry = require('../lib/Registry');
const handlers = new SocketRegistry();
const Connection                  = require('../models/Connection');
const Person                      = require('../models/Person')

const ExecuteMultiple             = require('../handlers/ExecuteMultiple');
const Callback                    = require('../handlers/Callback');

// Debug  =======================================================
const Log                         = require('../handlers/Debug/Log');

// Connection  ==================================================
const GetConnection               = require('../handlers/Connection/Get');

// Room  ========================================================
const RequireNotConnectedToRoom   = require('../handlers/Room/RequireNotConnected');
const RequireConnectedToRoom      = require('../handlers/Room/RequireConnected');
const JoinRoom                    = require('../handlers/Room/Join');
const GetRoom                     = require('../handlers/Room/Get');
const LeaveRoom                   = require('../handlers/Room/Leave');

// Person  ======================================================
const RequireUnregistered         = require('../handlers/Room/Person/RequireUnregistered');
const RequireRegistered           = require('../handlers/Room/Person/RequireRegistered');
const RegisterInRoom              = require('../handlers/Room/Person/Register');
const NotifyRoomOfAllPeople       = require('../handlers/Room/Person/NotifyRoomOfAllPeople');
const IsHost                      = require('../handlers/Room/Person/IsHost');
const requirePersonInRoom         = (next=null) =>  new RequireConnectedToRoom(new RequireRegistered(next));

// Chat =========================================================
const Message                     = require('../handlers/Room/Chat/Message');




// Connection  ==================================================
handlers.public('get_connection',                         (new GetConnection()));
handlers.public('disconnect',                             new Callback(((req, res) => {
                                                            const con = req.getConnection();
                                                            const app = con.getApp();
                                                            const handlers = app.getHandlers('socket');
                                                            //------------------------------------------

                                                            handlers.execute('leave_room', con);
                                                          })));

// Room  ========================================================
handlers.public('join_room',                              (new RequireNotConnectedToRoom(new JoinRoom((...props) => {
                                                            (new GetConnection()).execute(...props);
                                                            (new GetRoom()).execute(...props);
                                                          }))));
handlers.private('get_room',                              (new RequireConnectedToRoom((...props) => {
                                                            (new GetRoom()).execute(...props);

                                                          })));


handlers.public('leave_room',                             (requirePersonInRoom((req, res) => {
                                                            const con = req.getConnection();
                                                            const person = req.get('person');
                                                            const room = req.get('room');
                                                            const app = con.getApp();
                                                            const roomManager = app.getManager('room');
                                                            //------------------------------------------
                                                            // Remove person from room
                                                            room.getPeople().remove(person.getId());

                                                            // Leave room
                                                            (new LeaveRoom((req, res) => {
                                                              // now that I have left the rooom

                                                              // update connection
                                                              con.setType(Connection.TYPE_PICK_ROOM);
                                                              (new GetConnection()).execute(req, res);

                                                              // Assign another host if nessary
                                                              const hasHost = room.hasOrAutoAssignHost();
                                                              if (hasHost) {
                                                              } else {
                                                                // @TODO destroy room
                                                                roomManager.remove();
                                                            
                                                              }

                                                              con.emit('room', null);
                                                      
                                                              (new NotifyRoomOfAllPeople()).execute(req, res);
                                                            })).execute(req, res);
                                                          })));
                                                          
// Person  ======================================================
handlers.public('register_in_room',                       (new RequireConnectedToRoom(new RequireUnregistered(new RegisterInRoom((req, res) => {
                                                            //------------------------------------------
                                                            (new NotifyRoomOfAllPeople()).execute(req, res);

                                                            const room = req.get('room');
                                                            console.log('join room', room.getPeople().serialize());
                                                            (new GetConnection()).execute(req, res);
                                                            (new GetRoom()).execute(req, res);
                                                          })))));

handlers.public('change_my_name',                         ((requirePersonInRoom((req, res) => {
                                                            const me = req.get('person');
                                                            const newName = req.getPayload();
                                                            //------------------------------------------

                                                            me.setName(String(newName));
                                                            (new NotifyRoomOfAllPeople()).execute(req, res);
                                                          }))))

handlers.public('set_host',                               ((requirePersonInRoom(new IsHost((req, res) => {
                                                            const me = req.get('person');
                                                            const room = req.get('room');
                                                            const newHostId = req.getPayload();
                                                            //------------------------------------------

                                                            const people = room.getPeople();
                                                            if (people.has(newHostId)) {
                                                              const newHost = people.get(newHostId);
                                                              newHost.setType(Person.TYPE_HOST);
                                                              me.setType(Person.TYPE_MEMBER);

                                                              (new NotifyRoomOfAllPeople()).execute(req, res);
                                                            }
                                                          })))));

// Chat =========================================================
handlers.public('message',                                requirePersonInRoom(new Message()));






module.exports = handlers;
/*



// Connection type  =============================================
handlers.public('get_connection',                     new GetConnection());
handlers.public('get_connection_type',                new GetConnectionType());
handlers.public('set_connection_type',                new SetConnectionType());
handlers.public('disconnect',                         new ExecuteMultiple(['unregister_person', 'room_disconnect'])); 

// Rooms ========================================================
handlers.private('notify_room_people_all_keyed',      new ContextFromRoomId(new NotifyEveryoneInRoomOfAllPeople()));
handlers.private('notify_room_updated',               new ContextFromRoomId(new NotifyUpdatedRoom()));
handlers.public('get_current_room',                   new RequireRoomConnection(new GetCurrentRoom(new GetPeopleInRoom())));
handlers.public('get_room_list',                      new ListRooms());
handlers.public('join_room',                          (new JoinRoom(requireRegisteredInRoom(new NotifyEveryoneInRoomOfAllPeople(new GetChatTranscript())))));
handlers.public('leave_room',                         requireRegisteredInRoom(new LeaveRoom(new RemovePersonFromRoom(new Unregister(new NotifyEveryoneInRoomOfAllPeople())))));
handlers.public('room_disconnect',                    requireRegisteredInRoom(new LeaveRoom(new RemovePersonFromRoom(new NotifyEveryoneInRoomOfAllPeople()))));

// Person =======================================================
handlers.public('register_person',                    (new RequireRoomConnection(new RegisterPersonInRoom())));
handlers.public('change_my_name',                     (requireRegisteredInRoom(new ChangeMyName(new NotifyEveryoneInRoomOfAllPeople()))))

// Chat =========================================================
handlers.public('message',                            requireRegisteredInRoom(new SendMessage()));
handlers.public('typing',                             requireRegisteredInRoom(new NotifyIsTyping()));
handlers.public('get_chat_transcript',                requireRegisteredInRoom(new GetChatTranscript()));


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
