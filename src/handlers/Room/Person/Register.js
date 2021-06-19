const SocketHandler = require('../../../lib/ActionHandler');
const Person = require('../../../models/Person');


module.exports = class extends SocketHandler {
  execute(req, res) {
    const room = req.get('room');
    const connection = req.getConnection();
    const app = connection.getApp();
    const personManager = app.getManager('person');
    const personName = req.getPayload();
    //---------------------------------

    // Create person
    const person = personManager.create({
      name: personName,
    })
    personManager.store(person);
    person.connect(connection);

    // Add person to room
    room.addPerson(person);


    // Detect if room has a host
    const hosts = room.getPeople().filter((p) => p.getStatus() == Person.STATUS_CONNECTED && p.getType() == Person.TYPE_HOST);
    let hasHost = hosts.length != 0;

    // Set as host if nessary
    let personType = Person.TYPE_MEMBER;
    if (!hasHost) {
      personType = Person.TYPE_HOST;
    }
    person.setType(personType);



    // Set person context for following handlers
    req.set('person', person);

    //---------------------------------
    // Exxecute next handler
    this.next(req, res);
  }
}