const SocketHandler = require('../../../lib/ActionHandler');

module.exports = class extends SocketHandler {
  execute(req, res) {
    const connection = req.getConnection();
    const app = connection.getApp();
    const personManager = app.getManager('person');
    const personId = connection.getPersonId();
    if (personId) {
      console.log('registered');
      const person = personManager.get(personId);
      req.set('person', person);
      this.next(req, res);
    }
  }
}
