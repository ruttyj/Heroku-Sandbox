const BaseProvider = require('./BaseProvider');
const socketHandlerRegistry = require('../handlers/socketHandlers');

module.exports = class extends BaseProvider 
{
  register(app) 
  {
    app.addRegistry('socket', socketHandlerRegistry);
  }
}
