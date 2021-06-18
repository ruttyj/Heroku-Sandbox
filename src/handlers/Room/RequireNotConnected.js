const SocketHandler = require('../../lib/ActionHandler');

module.exports = class extends SocketHandler {
  execute(req, res) {
    const room = req.get('room');
    if (!room) {
      this.next(req, res);
    }
  }
}
