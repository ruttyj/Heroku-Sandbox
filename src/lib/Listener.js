const { Observable, Subscriber, PartialObserver } = require('rxjs');

module.exports = class Listener {

    constructor() {
        this.mOnSubscribers = [];
        this.mOnceSubscribers = [];

        const self = this;
        this.mOnObservable = new Observable((observer) => {
            self.mOnSubscribers.push(observer);
        });
        this.mOnceObservable = new Observable((observer) => {
            self.mOnceSubscribers.push(observer);
        });
    }

    on(fn) {
        return this.mOnObservable.subscribe(fn);
    }

    once(fn) {
        return this.mOnceObservable.subscribe(fn);
    }

    off() {
        this.mOnSubscribers.forEach((observer) => {
            observer.unsubscribe();
        });
        this.mOnceSubscribers.forEach((observer) => {
            observer.unsubscribe();
        });
    
        this.mOnSubscribers = [];
        this.mOnceSubscribers = [];
    }

    emit(value) {
        this.mOnSubscribers.forEach((observer) => {
          observer.next(value);
        });
    
        this.mOnceSubscribers.forEach((observer) => {
          observer.next(value);
          observer.unsubscribe();
        });
        this.mOnceSubscribers = [];
      }
}