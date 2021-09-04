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

  run(req, res, next) {
    next(req, res);
  }

  execute(req, res) {
    const doTheThing = new Callback(this.run);

    // Link up the requirements to this handler inside out -> new hander(new hander(new hander(new hander(HERE))))
    let entryPoint = doTheThing;
    this.require().reverse().forEach((handler) => {
      handler.setNext(entryPoint);
      entryPoint = handler;
    })
    entryPoint.execute(req, res);
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