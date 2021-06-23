const SocketHandler = require('../../../lib/ActionHandler');
const Person = require('../../../models/Person');

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

    // Set person context for following handlers
    req.set('person', person);

    //---------------------------------
    // Exxecute next handler
    this.next(req, res);
  }
}