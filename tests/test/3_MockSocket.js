const { expect } = require('chai');
const { describe, it } = require('mocha');
const MockSocketIo = require('../../src/lib/MockSocketIo');

/**********************************************
 * 
 *                MockSocket
 * 
 **********************************************/
 describe('MockSocket', () => {
  const mockSocketIo = new MockSocketIo();
  const log = new Map();

  const onConnection = (socket) => {
    log.set('connected:'+socket.id, true);

    socket.on('eventKey', (num) => {
        log.set('event_on', num);
    })
    
    socket.once('eventKey', (num) => {
        log.set('event_once', num);
    })

    socket.on('joinRoom', (code) => {
        socket.join(code)
    })

    socket.on('leaveRoom', (code) => {
        socket.leave(code)
    })

    socket.on('triggerRoom', (code) => {
        log.set('room:'+code+':'+socket.id, true);
        console.log('trigger ', 'room:'+code+':'+socket.id);
        socket.to(code).emit('response', 'message from room '+code);
    })
  }
  mockSocketIo.on('connection', onConnection);


  const { client: client1, server: server1 } = mockSocketIo.make();
  const { client: client2, server: server2 } = mockSocketIo.make();

  it('client1 connected', () => {
      expect(log.get('connected:1')).to.equal(true);
  });
  
  it('client2 connected', () => {
      expect(log.get('connected:2')).to.equal(true);
  });

  it('should execute "on" multiple times', () => {
    client1.emit('eventKey', 1);
    expect(log.get('event_on')).to.equal(1);
    expect(log.get('event_once')).to.equal(1);
  })

})