const SocketHandler = require('../../lib/ActionHandler');
      
module.exports = class extends SocketHandler {
  execute(req, res) {
    console.log('execute', req.getPayload());

    //---------------------------------
    this.next(req, res);
  }

  finish(req, res) {
    let connection = req.getConnection();
    console.log('finish', req.getPayload(), connection.serialize());
  }
}
