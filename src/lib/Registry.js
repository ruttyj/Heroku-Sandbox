const ActionRequest = require('./ActionRequest');
const ActionResponse = require('./ActionResponse');

module.exports = class Registry {
  constructor() {
    // Will replace the above subjects
    this.mEvents = {
      public: {},
      private: {}
    };
  }

  isPublic(identifier) {
    return !(!this.mEvents.public[identifier]);
  }

  isPrivate(identifier) {
    return !(!this.mEvents.private[identifier]);
  }

  getPublicKeys() {
    return Object.keys(this.mEvents.public);
  }

  public(identifier, handlerChain) {
    if (!this.mEvents.public[identifier])
      this.mEvents.public[identifier] = handlerChain;
  }

  private(identifier, handlerChain) {
    if (!this.mEvents.private[identifier])
      this.mEvents.private[identifier] = handlerChain;
  }

  execute(eventKey, connection, payload) {
    // Request
    const req = new ActionRequest(connection);
    req.getContext().set('payload', payload);

    // Response
    const res = new ActionResponse();

    let listener;

    // Execute
    if (!listener && this.mEvents.public[eventKey]) {
      listener = this.mEvents.public[eventKey];
      console.log('public listener', eventKey, listener);

    }

    if (!listener && this.mEvents.private[eventKey]) {
      listener = this.mEvents.private[eventKey];
      console.log('private listener', eventKey, listener);
    }

    if (listener) {
      return listener.execute(eventKey, req, res);
    }

    return null;
  }
}