const SocketHandler = require('../../../lib/ActionHandler');
module.exports = class extends SocketHandler {
  execute(req, res) {
    let person = req.get('person');
    if (person) {
      person.emit('me', person.serialize());
    } else {
      person.emit('me', null);
    }
    this.next(req, res);
  }
}
