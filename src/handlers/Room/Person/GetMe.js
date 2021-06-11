const SocketHandler = require('../../../lib/ActionHandler');

module.exports = class extends SocketHandler {
  execute(eventKey, req, res) {
    let person = req.get('person');
    person.emit('me', person.serialize());
    this.next(eventKey, req, res);
  }
}
