const SocketHandler = require('../../../lib/ActionHandler');
const IsHost = require('../Person/IsHost');

module.exports = class extends SocketHandler {
  execute(req, res) {
    const fn = () => {
      const room = req.get('room');
      //---------------------------------

      if (room.hasGame()) {
        room.createGame();
      }

      //---------------------------------
      // Exxecute next handler
      this.next(req, res);
    }
    const handler = new IsHost(fn);
    handler.execute(req, res);
  }
}
