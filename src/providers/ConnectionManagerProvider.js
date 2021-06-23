const BaseProvider = require('./BaseProvider');
const ConnectionManager = require('../managers/socket/ConnectionManager');
const cookie = require("cookie");
const { isDef, getNestedValue } = require('../lib/utils');

module.exports = class extends BaseProvider 
{
  register(app) 
  {
    // Register Connection Manager
    app.addManager('connection', new ConnectionManager(app));
  }

  boot(app)
  {
    const connectionManager = app.getManager('connection');
    const socketHandlers = app.getRegistry('socket');

    // On socket connection
    const io = app.getService('socketio');
    io.on('connection', (socket) => {
      console.log('Socket connected:', socket.id);

      // Associate socket to cookie
      //let cookies = cookie.parse(socket.request.headers.cookie);
      //console.log('socket cookie', cookies);


      // Create object to store connection data
      const connection = connectionManager.makeConnection(socket.id);
      connection.setSocket(socket);
      connection.setApp(app);

      //--------------------------------------
      // Listeners

      // Register when to destroy connection
      socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
        connectionManager.destroyConnection(socket.id);
      });

      // Execute socket handlers
      socketHandlers.getPublicKeys().forEach((eventKey) => {
        socket.on(eventKey, (payload) => {
          console.log('eventKey', eventKey);
          socketHandlers.execute(eventKey, connection, payload);
        });
      })

      //--------------------------------------
      // Emit
      socket.emit('connection', connection.serialize());
    });
    setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
  }
}
