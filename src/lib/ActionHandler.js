module.exports = class ActionHandler
{
  constructor(next = null)
  {
      this.setNext(next);
  }

  setNext(next = null)
  {
    this.mNext = next;
  }

  isFailure(eventKey, req, res) 
  {
      return res.isFailure();
  }

  // Executes on the way down the chain & can be interupted
  execute(eventKey, req, res) 
  {
      if (!this.isFailure(eventKey, req, res)) {
          // Override implementation here
          
          this.next(eventKey, req, res);
      } 
  }

  // Executes on the way up the chain
  finish(eventKey, req, res) 
  {
      // Override implementation here
  }

  next(eventKey, req, res) 
  {
      if (!this.isFailure(eventKey, req, res)) {
          if (this.mNext){
              this.mNext.execute(eventKey, req, res);
          }

          if (this.finish) {
              this.finish(eventKey, req, res);
          } 
      }
  }
}