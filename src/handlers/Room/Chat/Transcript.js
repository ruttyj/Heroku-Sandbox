const SocketHandler = require('../../../lib/ActionHandler');
// ==============================================================
// Get Transcript
// ==============================================================
module.exports = class extends SocketHandler {
  execute(eventKey, req, res) {
    const room = req.get('room');
    const me = req.get('person');
    //---------------------------------
    
    const chat = room.getChat();
    me.emit('chat_transcript', chat.serialize());

    //---------------------------------
    this.next(eventKey, req, res);
  }
}
