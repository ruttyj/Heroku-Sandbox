const { expect } = require('chai');
const { describe, it } = require('mocha');
const MockSocketIo = require('../../src/lib/MockSocketIo');
const App = require('../../src/App');
const Room = require('../../src/models/Room');
const Person = require('../../src/models/Person');
const Connection = require('../../src/models/Connection');

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

const logEventListener = (log, client, eventKey) => {
  client.once(eventKey, (payload) => {
    log.set(eventKey, payload);
  }); 
}

const makeApp = () => {
  const app = new App();
  // Add service providers required for app to run
  app.addProvider(new MockSocketIoProvider());
  app.addProvider(new HandlerRegistryProvider());
  app.addProvider(new ConnectionManagerProvider());
  app.addProvider(new PersonManagerProvider());
  app.addProvider(new RoomManagerProvider());
  app.start();
  return app;
}

/**********************************************
 * 
 *              Setup Application
 * 
 **********************************************/
const app = makeApp();
const io = app.getService('socketio');

const {
  client: client1,
  server: server1,
} = io.make();

const {
  client: client2,
  server: server2,
} = io.make();

const {
  client: client3,
  server: server3,
} = io.make();

const roomManager = app.getManager('room');
const conManager = app.getManager('connection');

describe('Connect to Application', () => {
  it("client's should connect", () => {
    expect(conManager.count()).to.equal(3);
  });
});

const log = (item) => console.log(JSON.stringify(item, null, 2))
describe("Client 1 can join room", () => {
  
  // Client 1 Join Room AAA
  it("Client 1 Join Room AAA", () => {
    
    let room;
    let people;

    client1.emit('join_room', 'AAA');
    client1.emit('register_in_room', 'Jordan');

    client2.emit('join_room', 'AAA');
    client2.emit('register_in_room', 'Joe');
    client2.emit('change_my_name', 'Bob');
  
    client3.emit('join_room', 'AAA');
    client3.emit('register_in_room', 'Janna');

    //client1.emit('leave_room');


    client1.emit('toggle_ready');
    client1.emit('toggle_ready');

    room = roomManager.getByCode('AAA');
    people = room.getPeople();
    //log(room.serialize());
    log(people.serialize());
    // 2 and 3 should remain; person 2 should be the host



  })

  /*
  it('Client 2 disconnects', () => {
    const c3Log = new Map();
    
    const c3People = c3Log.get('room_people_all_keyed');

    client2.emit('disconnect');
    expect(c3People.items['3'].type).to.equal('host');
    expect(c3People.order.length).to.equal(1);
  })
  //*/
})

