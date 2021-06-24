const SocketHandler = require('../../../lib/ActionHandler');

module.exports = class extends SocketHandler {
  execute(req, res) {
    const connection = req.getConnection();
    const room = req.get('room');
    const people = room.getPeople();
    const personId = connection.getPersonId();
    if (personId) {
      console.log('registered');
      const person = people.get(personId);
      req.set('person', person);
      this.next(req, res);
    }
  }
}
