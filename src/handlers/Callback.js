const SocketHandler = require('../lib/ActionHandler');
module.exports = class ActionHandler
{
  constructor(callback, next=null)
  {
    this.setNext(next);
    this.mCallback = callback;
  }

  setNext(next = null)
  {
    this.mNext = next;
  }

  isFailure(req, res) 
  {
      return res.isFailure();
  }

  // Executes on the way down the chain & can be interupted
  execute(req, res) 
  {
      if (!this.isFailure(req, res)) {
          // Override implementation here
          const doNext = () => {
            this.next(req, res);
          }
          this.mCallback(req, res, doNext);
      } 
  }

  // Executes on the way up the chain
  finish(req, res) 
  {
      // Override implementation here
  }

  next(req, res) 
  {
      if (!this.isFailure(req, res)) {
          if (this.mNext){
              this.mNext.execute(req, res);
          }

          if (this.finish) {
              this.finish(req, res);
          } 
      }
  }
}