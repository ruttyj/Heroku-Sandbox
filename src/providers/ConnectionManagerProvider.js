const BaseProvider = require('./BaseProvider');
const ConnectionManager = require('../managers/socket/ConnectionManager');
const socketHandlerRegistry = require('./socketRegistery');
module.exports = class extends BaseProvider 
{
  register(app) 
  {
    // Register Connection Manager
    app.addManager('connection', new ConnectionManager(app));
    app.addHanderRegistry('socket', socketHandlerRegistry);
  }

  boot(app)
  {
    const connectionManager = app.getManager('connection');

    // On socket connection
    const io = app.getService('socketio');
    io.on('connection', (socket) => {
      console.log('Socket connected:', socket.id);

      // Create object to store connection data
      const connection = connectionManager.makeConnection(socket.id);
      connection.setSocket(socket);
      connection.setApp(app);

      // Register when to destroy connection
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
  }
}
