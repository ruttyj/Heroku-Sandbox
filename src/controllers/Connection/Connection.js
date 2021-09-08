const ProtectedHandler = require('../../lib/ProtectedHandler');

const controller = {
  ////////////////////////////////////////
  // GET
  get: (next = null) => new (class extends ProtectedHandler { 
    require() {
      return [
      ]
    }
    run(req, res, next) {
      const con   = req.getConnection();
      const socket = con.getSocket();
      //---------------------------------
  
      socket.emit('connection', con.serialize())
  
      //---------------------------------
      next(req, res);
    }
  })(next),


  ////////////////////////////////////////
  // DISCONNECT
  disconnect: (next = null) => new (class extends ProtectedHandler {
    run(req, res, next)
    {
      const con = req.getConnection();
      const app = con.getApp();
      const handlers = app.getHandlers('socket');
      //------------------------------------------

      handlers.execute('leave_room', con);

      //---------------------------------
      next(req, res);
    }
  })(next),
}

module.exports = controller;