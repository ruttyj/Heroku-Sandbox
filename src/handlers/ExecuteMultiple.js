const SocketHandler = require('../lib/ActionHandler');

module.exports = class extends SocketHandler 
{
  constructor(eventList, next=null)
  {
    super(next);
    this.mEventList = eventList;
  }
unregister_person
  execute(req, res) 
  {
    console.log('ExecuteMultiple');
    if (!this.isFailure(req, res)) {
      const events = this.mEventList;
      const connection = req.getConnection();
      const app = connection.getApp();
      const socketHandlers = app.getRegistry('socket');
      events.forEach(key => {
        socketHandlers.execute(key, connection, req.getPayload());
      })
      this.next(req, res);
    }
  }
}