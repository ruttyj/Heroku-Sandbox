const SocketHandler = require('../../../lib/ActionHandler');
const Person = require('../../../models/Person');
const Connection = require('../../../models/Connection');
module.exports = class extends SocketHandler {
  execute(req, res) {
    const room = req.get('room');
    const con = req.getConnection();
    const me = req.get('person');
    
    //---------------------------------
    if (me.hasTag(Person.IS_READY)) {
      me.removeTag(Person.IS_READY);
    } else {
      me.addTag(Person.IS_READY);
    }

    //---------------------------------
    // Exxecute next handler
    this.next(req, res);
  }
}