const SocketHandler = require('../../../lib/ActionHandler');

module.exports = class extends SocketHandler {
  execute(req, res) {
    const connection = req.getConnection();
    const personId = connection.getPersonId();
    if (!personId) {
      this.next(req, res);
    }
  }
}
