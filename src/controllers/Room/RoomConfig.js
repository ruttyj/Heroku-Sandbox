const ProtectedHandler = require('../../lib/ProtectedHandler');
const personController = require('../../controllers/Person/Person');
const roomController = require('../../controllers/Room/Room');
const roomConfigController = {
  updateConfig: (next = null) => new (class extends ProtectedHandler {
    require()
    {
      return [
        personController.requireIsHost(),
      ]
    }
    run(req, res)
    {
      const payload = req.getPayload();
      const room = req.get('room');
      //------------------------------------------
      try {
        const key = payload.key;
        const value = payload.value;
    
        const roomConfigs = room.getConfig();
        if (roomConfigs.hasField(key)) {
          roomConfigs.updateField(key, value);
    
          roomController.notifyRoomOfUpdate().execute(req, res);
        }
      } catch (e) {
        console.log(e);
      }
    }
  })(next),
}

module.exports = roomConfigController;