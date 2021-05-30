const BaseProvider = require('./BaseProvider');
const PersonManager = require('../managers/PersonManager');
module.exports = class extends BaseProvider 
{
  register(app) 
  {
    app.addManager('person', new PersonManager(app));
  }

  boot(app)
  {
    
  }
}
