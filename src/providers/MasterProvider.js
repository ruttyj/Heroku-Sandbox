const BaseProvider = require('./BaseProvider');
const ConnectionManager = require('../managers/socket/ConnectionManager');
const socketHandlerRegistry = require('./socketRegistery');
module.exports = class MasterProvider extends BaseProvider 
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

      // Register on when to destroy connection
      socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
        connectionManager.destroyConnection(socket.id);
      });

      // Execute socket handlers
      socketHandlerRegistry.getPublicKeys().forEach((eventKey) => {
        socket.on(eventKey, (payload) => {
          socketHandlerRegistry.execute(eventKey, connection, payload);
        });
      })
     
    });
    setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
  
    // app will run now ----------------------
  }
}
