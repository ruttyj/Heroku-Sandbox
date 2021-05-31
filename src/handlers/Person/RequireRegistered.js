const SocketHandler = require('../../lib/ActionHandler');

/**
 * Require person
 * 
 * Will require that the current socket is 
 *  connected to a person to continue executing handlers.
 */
module.exports = class extends SocketHandler {
  execute(eventKey, req, res) {
    const connection = req.getConnection();
    const app = connection.getApp();
    const personManager = app.getManager('person');
    //---------------------------------

    // If connection is registered to a person 
    // disconnect from person
    let person = connection.getPerson();
    if (person) {
      // Set context
      req.set('myPersonId', person.getId());
      req.set('me', person);
      req.set('personManager', personManager);

      // Execute next handler
      this.next(eventKey, req, res);
      return;
    }

    // else failure
    res.setIsFailure(true);
  }
}
