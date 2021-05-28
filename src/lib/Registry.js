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

  registerPublic(identifier, handlerChain) {
    if (!this.mEvents.public[identifier])
      this.mEvents.public[identifier] = handlerChain;
  }

  getPublicKeys() {
    return Object.keys(this.mEvents.public);
  }

  registerPrivate(identifier, handlerChain) {
    if (!this.mEvents.private[identifier])
      this.mEvents.private[identifier] = handlerChain;
  }

  execute(eventKey, connection, payload) {
    // Request
    const req = new ActionRequest(connection);
    req.getContext().set('payload', payload);

    // Response
    const res = new ActionResponse();

    // Execute
    if (this.mEvents.public[eventKey]) {
      let listener = this.mEvents.public[eventKey];

      if (!listener) {
        this.mEvents.private[eventKey];
      }

      if (listener) {
        return listener.execute(eventKey, req, res);
      }
    }

    return null;
  }
}