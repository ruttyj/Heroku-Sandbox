const SocketHandler = require('../../lib/ActionHandler');
      
module.exports = class extends SocketHandler {
  execute(eventKey, req, res) {
    console.log('execute', eventKey, req.getPayload());

    //---------------------------------
    this.next(eventKey, req, res);
  }

  finish(eventKey, req, res) {
    let connection = req.getConnection();
    console.log('finish', eventKey, req.getPayload(), connection.serialize());
  }
}
