const { expect } = require('chai');
const { describe, it } = require('mocha');
const ListenerMap = require('../../src/lib/ListenerMap');

/**********************************************
 * 
 *                ListenerMap
 * 
 **********************************************/
 describe('ListenerMap', () => {
  let listenerMap = new ListenerMap();
  let log = new Map();
  
  function resetLog() {
      log.set('event_on', 0);
      log.set('event_once', 0);
  }

  function makeOnListener() {
      listenerMap.on('event_on', (v) => {
          log.set('event_on', v)
      })
  }

  function makeOnceListener() {
      listenerMap.once('event_once', (v) => {
          log.set('event_once', v)
      })
  }

  it('should emit event to the correct eventKey', () => {
      resetLog();
      makeOnListener();
      makeOnceListener();

      // only on
      listenerMap.emit('event_on', 1);
      expect(log.get('event_on')).to.equal(1);
      expect(log.get('event_once')).to.equal(0);
      listenerMap.off('event_on');

      // only once
      resetLog();
      listenerMap.emit('event_once', 2);
      expect(log.get('event_on')).to.equal(0);
      expect(log.get('event_once')).to.equal(2);
      listenerMap.off('event_once');

      // Both once and on
      resetLog();
      listenerMap.on('event', (v) => {
          log.set('event_on', v)
      })
      listenerMap.once('event', (v) => {
          log.set('event_once', v)
      })
      listenerMap.emit('event', 3);
      expect(log.get('event_on')).to.equal(3);
      expect(log.get('event_once')).to.equal(3);


      // both are off now
      resetLog();
      listenerMap.off('event');
      listenerMap.emit('event', 5);
      expect(log.get('event_on')).to.equal(0);
      expect(log.get('event_once')).to.equal(0);
  });
})
