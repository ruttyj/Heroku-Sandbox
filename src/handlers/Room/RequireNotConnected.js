const SocketHandler = require('../../lib/ActionHandler');

module.exports = class extends SocketHandler {
  execute(eventKey, req, res) {
    const room = req.get('room');
    if (!room) {
      this.next(eventKey, req, res);
    }
  }
}
