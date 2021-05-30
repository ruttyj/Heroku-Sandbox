const BaseProvider = require('./BaseProvider');
const socketHandlerRegistry = require('./socketRegistery');

module.exports = class extends BaseProvider 
{
  register(app) 
  {
    app.addRegistry('socket', socketHandlerRegistry);
  }
}
