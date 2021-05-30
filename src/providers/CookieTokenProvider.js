const BaseProvider = require('./BaseProvider');
const { getNestedValue, isDef } = require('../lib/utils');
const CookieTokenManager = require('../managers/CookieTokenManager');

module.exports = class extends BaseProvider {
  register(app)
  {
    app.addManager('cookieToken', new CookieTokenManager(app));
    const cookieTokenManager = app.getManager('cookieToken');
  }

  boot(app)
  {

  }
}
