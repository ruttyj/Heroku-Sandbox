const BastProvider = require('./BaseProvider');
const ConnectionManager = require('../managers/socket/ConnectionManager');
const RoomModel = require('../models/mongodb/Room/Model');
module.exports = class MasterProvider extends BastProvider 
{
  register(app) 
  {

    // Register Connection Manager
    const connectionManager = new ConnectionManager();
    app.addManager('connection', connectionManager)
  
  
    // On socket connection
    const io = app.getService('socketio');
    io.on('connection', (socket) => {
      console.log('Socket connected:', socket.id);
      
      // Create connection
      const connection = connectionManager.makeConnection(socket.id);
      connection.setSocket(socket);
      connection.setApp(app);

      // Register on socket disconnect
      socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
        connectionManager.destroyConnection(socket.id);
      });


      // Connection type ==============================================
      socket.on('get_connection_type', () => {
        socket.emit('connection_type', connection.getType());
      });

      socket.on('set_connection_type', (value) => {
        connection.setType(value);
        socket.emit('connection_type', connection.getType());
      });


      // Rooms ========================================================
      // join
      socket.on('join_room', (value) => {
     
        let roomCode = value;
        let roomTitle = roomCode;

        // Create room data
        const roomData = {
          code: roomCode,
          title: roomTitle,
          playerCount: 0,
          joinable: true,
          mode: "in_setup",
          state: "{}",
        }

        // Save Model to DB
        const newModel = new RoomModel(roomData);
        const onModelSave = (error) => {
          if (error) {
            connection.setType('room');
            socket.emit('create_room', {
              status: "failure",
              msg: "error"
            });
          } else {
            // let know succeeded to create
            socket.emit('create_room', {
              status: "success",
              msg: "success"
            });

            // sent roomd data to client
            socket.emit('room', roomData);
          }
        }
        newModel.save(onModelSave);

        socket.emit('connection_type', connection.getType());
      });

      // list
      socket.on('get_room_list', () => {
        RoomModel.find({})
          .then((data) => {
            socket.emit('room_list', {
              status: "success",
              data: data
            });
          })
          .catch((error) => {
            console.log('error:', error)
          });
      })


    });
    setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
  
    // app will run now ----------------------
  }
}
