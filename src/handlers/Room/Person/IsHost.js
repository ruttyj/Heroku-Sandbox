const SocketHandler = require('../../../lib/ActionHandler');
const Person = require('../../../models/Person');

module.exports = class extends SocketHandler {
  execute(req, res) {
    const con = req.getConnection();
    const me = req.get('person');
    //------------------------------------------
    if (me.getType() == Person.TYPE_HOST) {
      this.next(req, res);
    }
  }
}