const BaseProvider = require('./BaseProvider');
const RoomManager = require('../managers/RoomManager');
module.exports = class extends BaseProvider 
{
  register(app) 
  {
    app.addManager('room', new RoomManager());
  }

  boot(app)
  {
    
  }
}
