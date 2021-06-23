const Listener = require('./Listener');

module.exports = class ListenerMap {

    constructor() {
        this.mMap = new Map();
    }

    addEvent(eventName) {
        if (!this.hasEvent(eventName)) {
            this.makeEvent(eventName);
        }
    }

    hasEvent(eventName) {
        return this.mMap.has(eventName);
    }

    makeEvent(eventName) {
        this.mMap.set(eventName, new Listener());
    }

    getEvent(eventName) {
        return this.mMap.get(eventName);
    }

    deleteEvent(eventName) {
        this.mMap.delete(eventName);
    }

    on(eventName, fn) {
        this.addEvent(eventName);
        return this.getEvent(eventName).on(fn);
    }

    once(eventName, fn) {
        this.addEvent(eventName);
        return this.getEvent(eventName).once(fn);
    }

    emit(eventName, payload) {
        this.addEvent(eventName);
        return this.getEvent(eventName).emit(payload);
    }

    // removes both on and once
    off(eventName) {
        if (this.hasEvent(eventName)) {
            this.getEvent(eventName).off();
            this.deleteEvent(eventName);
        }
    }
}