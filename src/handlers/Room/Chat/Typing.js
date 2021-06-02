const SocketHandler = require('../../../lib/ActionHandler');
const Typing = require('../../../models/Chat/Typing');
// ==============================================================
// Is Typing
// ==============================================================
module.exports = class extends SocketHandler {
  execute(eventKey, req, res) {
    const room = req.get('room');
    const me = req.get('me');
    const value = req.getPayload();
    //---------------------------------

    const typing = new Typing({
      isTyping: value == true,
      authorId: me.getId(),
    });

    room.emitToEveryoneElse('typing', typing.serialize());

    //---------------------------------
    this.next(eventKey, req, res);
  }
}
