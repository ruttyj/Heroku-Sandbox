const ProtectedHandler = require('../../lib/ProtectedHandler');
const Person  = require('../../models/Person')
const personController = {
  ////////////////////////////////////////
  // 
  unnamed: () => new (class extends ProtectedHandler {
    run(req, res, next)
    {
      next(req, res);
    }
  })(),
}

module.exports = personController;