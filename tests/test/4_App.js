const { expect } = require('chai');
const { describe, it } = require('mocha');
const MockSocketIo = require('../../src/lib/MockSocketIo');
const App = require('../../src/App');

const HandlerRegistryProvider = require('../../src/providers/HandlerRegistryProvider');

const ConnectionManagerProvider = require('../../src/providers/ConnectionManagerProvider');

const PersonManagerProvider = require('../../src/providers/PersonManagerProvider');
const RoomManagerProvider = require('../../src/providers/RoomManagerProvider');

const BaseProvider = require('../../src/providers/BaseProvider');


class MockSocketIoProvider extends BaseProvider {
  register(app)
  {
    const io = new MockSocketIo();

    // SocketIO ======================================
    app.addService('socketio', io);
  }
}



/**********************************************
 * 
 *                MockSocket
 * 
 **********************************************/
 describe('App', () => {
  const log = new Map();
  
  // App ===========================================
  const app = new App();
  // Add service providers required for app to run
  app.addProvider(new MockSocketIoProvider());
  app.addProvider(new HandlerRegistryProvider());
  app.addProvider(new ConnectionManagerProvider());
  app.addProvider(new PersonManagerProvider());
  app.addProvider(new RoomManagerProvider());
  
  app.start();

})