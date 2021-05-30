const socketIO = require('socket.io');
const BaseProvider = require('./BaseProvider');

// Socket IO Provider
module.exports = class SocketIoProvider extends BaseProvider {
  register(app)
  {
    const httpServer = app.getService('http');
    // SocketIO ======================================
    const io = socketIO(httpServer);
    app.addService('socketio', io);
  }
}