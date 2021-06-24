const SocketHandler = require('../../../lib/ActionHandler');
const Person = require('../../../models/Person');
const Connection = require('../../../models/Connection');
module.exports = class extends SocketHandler {
  execute(req, res) {
    const room = req.get('room');
    const con = req.getConnection();
    const personName = req.getPayload();
    //---------------------------------

    // Create person
    const person = new Person({
      name: personName,
    });
    person.setType(Person.TYPE_MEMBER);
    room.addPerson(person);

    person.connect(con);

    // Assign host if none exists
    room.hasOrAutoAssignHost();

    con.emit('me', person.getId());
    con.setType(Connection.TYPE_IN_ROOM);

    // Set person context for following handlers
    req.set('person', person);

    //---------------------------------
    // Exxecute next handler
    this.next(req, res);
  }
}