const SocketHandler = require('../../../lib/ActionHandler');

module.exports = class extends SocketHandler {
  execute(eventKey, req, res) {
    const room = req.get('room');
    const connection = req.getConnection();
    const app = connection.getApp();
    const personManager = app.getManager('person');
    const personName = req.getPayload();
    //---------------------------------

    // Create person
    const person = personManager.create({
      name: personName
    })
    personManager.store(person);
    person.connect(connection)
    // Add person to room
    room.addPerson(person);

    // Set person context for following handlers
    req.set('person', person);

    //const people = room.getPeople()
    //const everyoneElse = people.getEveryoneElse(person);


    //---------------------------------
    // Exxecute next handler
    this.next(eventKey, req, res);
  }
}