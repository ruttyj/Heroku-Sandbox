const Room = require('../../models/Room');
const Connection = require('../../models/Connection');
const SocketHandler = require('../../lib/ActionHandler');
const HandlerFunc = require('../../handlers/Callback');
const ProtectedHandler = require('../../lib/ProtectedHandler');
const NotifyRoomOfAllPeople = require('../../handlers/Room/Person/NotifyRoomOfAllPeople');
const GetConnection = require('../../handlers/Connection/Get');

const controller = {
  ////////////////////////////////////////
  // GET
  get: () => new (class extends ProtectedHandler { 
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
  })(),


  ////////////////////////////////////////
  // DISCONNECT
  disconnect: () => new (class extends ProtectedHandler {
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
  })(),
}

module.exports = controller;