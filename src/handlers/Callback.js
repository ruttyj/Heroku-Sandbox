const SocketHandler = require('../lib/ActionHandler');

module.exports = class extends SocketHandler 
{
  constructor(callback, next=null)
  {
    super(next);
    this.mCallback = callback;
  }

  execute(eventKey, req, res) 
  {
      if (!this.isFailure(eventKey, req, res)) {
          // Override implementation here
          const doNext = () => {
            this.next(eventKey, req, res);
          }
          this.mCallback(eventKey, req, res, doNext);
      } 
  }
}