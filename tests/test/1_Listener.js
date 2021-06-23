const { expect } = require('chai');
const { describe, it } = require('mocha');
const Listener = require('../../src/lib/Listener');

/**********************************************
 * 
 *                  Listener
 * 
 **********************************************/
describe('Listener', () => {
  const listener = new Listener();
  const log = new Map();

  function attachOnListener() {
      listener.on((v) => {
          log.set('event_on', v);
      })
  }

  function attachOnceListener() {
      listener.once((v) => {
          log.set('event_once', v);
      })
  }

  it('should emit events to both "on" and "once"', () => {
      attachOnListener();
      attachOnceListener();
      listener.emit(1);
      expect(log.get('event_on')).to.equal(1);
      expect(log.get('event_once')).to.equal(1);
  })

  it('once should be removed after first emit', () => {
      listener.emit(2);
      expect(log.get('event_on')).to.equal(2);
      expect(log.get('event_once')).to.equal(1);
  })

  it('off should remove attached functions', () => {
      listener.off();

      listener.emit(3);
      expect(log.get('event_on')).to.equal(2);
      expect(log.get('event_once')).to.equal(1);
  })

  it('on and once functions are assigned correctly', () => {
      // Reset
      listener.off();
      log.set('event_on', 0);
      log.set('event_once', 0);
      
      // Test On
      attachOnListener();
      listener.emit(1);
      expect(log.get('event_on')).to.equal(1);
      expect(log.get('event_once')).to.equal(0);

      // Reset
      log.set('event_on', 0);
      log.set('event_once', 0);
      listener.off();

      // Test Once
      attachOnceListener();
      listener.emit(1);
      expect(log.get('event_on')).to.equal(0);
      expect(log.get('event_once')).to.equal(1);
  })
})
