const ProtectedHandler = require('../../lib/ProtectedHandler');
const personController = require('../../controllers/Person/Person');
const Message = require('../../models/Chat/Message');
const ChatController = {
  sendMessage: (next = null) => new (class extends ProtectedHandler {
    require()
    {
      return [
        personController.requireRegistered(),
      ]
    }
    run(req, res)
    {
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
    }
  })(next),
}

module.exports = ChatController;