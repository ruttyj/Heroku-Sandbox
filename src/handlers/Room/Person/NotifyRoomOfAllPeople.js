const SocketHandler = require('../../../lib/ActionHandler');


// ==============================================================
// List People in Room
// ==============================================================
module.exports = class extends SocketHandler {
  execute(req, res) {
    // get from context
    const room = req.get('room');
    const myConnection = req.getConnection();
    const person = req.get('person');
    const personId = person.getId();
    //---------------------------------

    // Get people in the room
    let people = room.getPeople();

    // If im not in the list whipe my people list
    if (!people.has(personId)) {
      myConnection.emit('room_people_all_keyed', {
        items: {},
        order: [],
      });
    } 

    // update everyone who is in the room
    room.emitToEveryone('room_people_all_keyed', people.serialize());
    //---------------------------------
    // Exxecute next handler
    this.next(req, res);
  }
}