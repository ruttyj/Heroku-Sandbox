const ListenerMap = require('./ListenerMap');

/**********************************************
 * 
 *                MockSocket
 * 
 **********************************************/
/**
 * This class simulates a Socket.io socket for testing purposes
 */
module.exports = class MockSocketIo {

  constructor() {
    this.mTopId = 0;
    this.mSockets = new Map();
    this.mOnConnection = () => {}
  }

  on(eventKey, fn) {
    switch(eventKey) {
      case 'connection':
        this.mOnConnection = fn;
      break;
      default:
    }
  }

  emit(eventKey, payload) {
    this.mSockets.forEach(socket => {
      socket.emit(eventKey, payload);
    })
  }

  make() {
    const toClient = new ListenerMap();
    const toServer = new ListenerMap();
    ++this.mTopId;
    const self = this;

    // methods must be wrapped in a function else 'this' context will be bound to client / server const
    // @TODO make this OOP
    
    const server = {
      id:     this.mTopId,
      on:     (eventKey, fn)     => toServer.on(eventKey, fn),
      once:   (eventKey, fn)     => toServer.once(eventKey, fn),
      emit:   (eventKey, value)  => toClient.emit(eventKey, value),
      broadcast: {
        emit: (eventKey, content) => {
          self.mSockets.forEach((socket, key) => {
            socket.emit(eventKey, content);
          })
        } 
      }
    }

    const client = {
      id:       this.mTopId,
      on:       (eventKey, fn)     => toClient.on(eventKey, fn),
      once:     (eventKey, fn)     => toClient.once(eventKey, fn),
      emit:     (eventKey, value)  => toServer.emit(eventKey, value),
    }

    this.mSockets.set(this.mTopId, server);

    toServer.on('connection', this.mOnConnection);
    toServer.emit('connection', server);

    return {client, server};
  }
}