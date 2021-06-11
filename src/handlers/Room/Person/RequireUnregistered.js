const SocketHandler = require('../../../lib/ActionHandler');

module.exports = class extends SocketHandler {
  execute(eventKey, req, res) {
    const connection = req.getConnection();
    const personId = connection.getPersonId();
    if (!personId) {
      this.next(eventKey, req, res);
    }
  }
}
