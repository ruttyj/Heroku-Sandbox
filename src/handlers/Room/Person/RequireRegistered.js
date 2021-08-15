const SocketHandler = require('../../../lib/ActionHandler');
const RequireConnectedToRoom = require('../RequireConnected');

module.exports = class extends SocketHandler {
  execute(req, res) {
    const fn = (req, res) => {
      const connection = req.getConnection();
      const room = req.get('room');
      const people = room.getPeople();
      const personId = connection.getPersonId();
      if (personId) {
        const person = people.get(personId);
        req.set('person', person);
        this.next(req, res);
      }
    }
    const hander = new RequireConnectedToRoom(fn);
    hander.execute(req, res);
  }
}
