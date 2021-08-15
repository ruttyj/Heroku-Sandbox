const SocketHandler = require('../../../lib/ActionHandler');
const Person = require('../../../models/Person');
const RequireRegistered = require('./RequireRegistered');

module.exports = class extends SocketHandler {
  execute(req, res) {

    const fn = (req, res) => {
      const me = req.get('person');
      //------------------------------------------
      if (me.hasTag(Person.TYPE_HOST)) {
        this.next(req, res);
      }
    };
    const handler = new RequireRegistered(fn);

    (handler).execute(req, res);
  }
}