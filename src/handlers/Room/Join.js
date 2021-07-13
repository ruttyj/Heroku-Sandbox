const SocketHandler = require('../../lib/ActionHandler');
const Room = require('../../models/Room');
const Connection = require('../../models/Connection');

const RoomController = require('../../controllers/Room/Room')

// ==============================================================
// Join Room
// ==============================================================
module.exports = class extends SocketHandler {
  execute(req, res) {
    const controller = new RoomController();
    controller.join(req, res, (...args) => this.next(...args)); // must keep this reference when executing
  }
}
