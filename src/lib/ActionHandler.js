const Callback = require('../handlers/Callback');
module.exports = class ActionHandler
{
  constructor(next = null)
  {
    if (typeof next === 'function') {
      this.setNext(new Callback(next));
      // do something
    } else {
      this.setNext(next);
    }
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
          
          this.next(req, res);
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