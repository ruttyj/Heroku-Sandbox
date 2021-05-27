const BastProvider = require('./BaseProvider');
const ConnectionManager = require('../managers/socket/ConnectionManager');

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
      const connection = connectionManager.makeConnection(socket.id);
      connection.setSocket(socket);

      // Register on socket disconnect
      socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
        connectionManager.destroyConnection(socket.id);
      });

      socket.on('connection_type', () => {
        socket.emit('connection_type', connection.getType());
      });

      socket.on('set_connection_type', (value) => {
        connection.setType(value);
        socket.emit('connection_type', connection.getType());
      });

    });
    setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
  
    // app will run now ----------------------
  }
}