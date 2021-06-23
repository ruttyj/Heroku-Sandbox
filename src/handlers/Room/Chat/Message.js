const SocketHandler = require('../../../lib/ActionHandler');
const Message = require('../../../models/Chat/Message');
// ==============================================================
// Send Message
// ==============================================================
module.exports = class extends SocketHandler {
  execute(req, res) {
    const room = req.get('room');
    const me = req.get('person');
    const value = req.getPayload();
    //---------------------------------

    const message = new Message({
      type: 'message',
      message: value,
      authorId: me.getId(),
      authorName: me.getName(),
    });

    const chat = room.getChat();
    chat.add(message);

    room.emitToEveryone('message', message.serialize());

    //---------------------------------
    this.next(req, res);
  }
}
