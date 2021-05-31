const SocketHandler = require('../../../lib/ActionHandler');
const Message = require('../../../models/Chat/Message');
// ==============================================================
// Join Room
// ==============================================================
module.exports = class extends SocketHandler {
  execute(eventKey, req, res) {
    const room = req.get('room');
    const me = req.get('me');
    const value = req.getPayload();
    //---------------------------------

    const message = new Message({
      type: 'message',
      message: value,
      authorId: me.getId(),
    });

    room.emitToEveryone('message', message.serialize());

    //---------------------------------
    this.next(eventKey, req, res);
  }
}
