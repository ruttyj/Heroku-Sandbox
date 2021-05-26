const socketIO = require('socket.io');
const BastProvider = require('./BaseProvider');

// Socket IO Provider
module.exports = class SocketIoProvider extends BastProvider {
  register(app)
  {
    const httpServer = app.getService('http');
    // SocketIO ======================================
    const io = socketIO(httpServer);
    app.addService('socketio', io);
  }
}