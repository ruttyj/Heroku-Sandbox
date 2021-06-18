const SocketHandler = require('../../../lib/ActionHandler');
module.exports = class extends SocketHandler {
  execute(eventKey, req, res) {
    let person = req.get('person');
    if (person) {
      person.emit('me', person.serialize());
    } else {
      person.emit('me', null);
    }
    this.next(eventKey, req, res);
  }
}
