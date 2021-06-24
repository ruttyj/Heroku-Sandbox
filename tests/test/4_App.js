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

const roomManager = app.getManager('room');
const conManager = app.getManager('connection');

describe('Connect to Application', () => {
  it("client's should connect", () => {
    expect(conManager.count()).to.equal(2);
  });
});

describe("Client 1 can join room", () => {
  
  // Client 1 Join Room AAA
  it("Client 1 Join Room AAA", () => {
    const log = new Map();
    logEventListener(log, client1, 'connection');
    logEventListener(log, client1, 'room');

    client1.emit('join_room', 'AAA');

    // Check that person is in room
    const room = roomManager.getByCode('AAA');
    expect(room).to.not.equal(null);
    expect(room.getCode()).to.equal('AAA');
    expect(room.getPeople().count()).to.equal(0);
 
    // Check that current room was emiitted
    const roomPayload = log.get('room');
    expect(roomPayload.code).to.equal('AAA');

    // Check the connection was updated
    expect(log.has('connection')).to.equal(true);
    const connection = log.get('connection');
    expect(connection.type).to.equal('register');
    expect(connection.roomId).to.equal(1);
    expect(connection.personId).to.equal(null);
  });
  

  it("Register Client 1 as Jordan in room", () => {
    const log = new Map();
    // Define what to log
    logEventListener(log, client1, 'room_people_all_keyed');
    logEventListener(log, client1, 'connection');
    logEventListener(log, client1, 'me');

    client1.emit('register_in_room', 'Jordan');

    // expect person list to update
    const peopleKeyed = log.get('room_people_all_keyed');
    expect(Object.keys(peopleKeyed.items).length).to.equal(1);
    const person = peopleKeyed.items['1'];
    expect(person.name).to.equal('Jordan');
    expect(peopleKeyed.order.length).to.equal(1);

    // Person should be the host
    expect(person.type).to.equal(Person.TYPE_HOST);

    // expect person id to be emitted
    const mePayload = log.get('me');
    expect(mePayload).to.equal(1);

    // expect connectio to be updated
    const connectionPayload = log.get('connection');
    expect(connectionPayload.personId).to.equal(1);
    expect(connectionPayload.type).to.equal(Connection.TYPE_IN_ROOM);
  })

})


describe("Client 2 can join room", () => {
  
  // Client 1 Join Room AAA
  it("Client 2 Join Room AAA", () => {
    const log = new Map();
    logEventListener(log, client2, 'connection');
    logEventListener(log, client2, 'room');

    client2.emit('join_room', 'AAA');

    // Check that person is in room
    const room = roomManager.getByCode('AAA');
    expect(room).to.not.equal(null);
    expect(room.getCode()).to.equal('AAA');
    expect(room.getPeople().count()).to.equal(1);
 
    // Check that current room was emiitted
    const roomPayload = log.get('room');
    expect(roomPayload.code).to.equal('AAA');

    // Check the connection was updated
    expect(log.has('connection')).to.equal(true);
    const connection = log.get('connection');
    expect(connection.type).to.equal('register');
    expect(connection.roomId).to.equal(1);
    expect(connection.personId).to.equal(null);
  });
  

  it("Register Client 2 as Joe in room", () => {
    const log = new Map();
    const client1Log = new Map();
    // Define what to log
    logEventListener(client1Log, client1, 'room_people_all_keyed');
    logEventListener(log, client2, 'room_people_all_keyed');
    logEventListener(log, client2, 'connection');
    logEventListener(log, client2, 'me');

    client2.emit('register_in_room', 'Joe');

    // expect person list to update
    const peopleKeyed = log.get('room_people_all_keyed');
    expect(Object.keys(peopleKeyed.items).length).to.equal(2);
    const person = peopleKeyed.items['2'];
    expect(person.name).to.equal('Joe');
    expect(peopleKeyed.order.length).to.equal(2);

    // Person should be the member
    expect(person.type).to.equal(Person.TYPE_MEMBER);


    // expect person id to be emitted
    const mePayload = log.get('me');
    expect(mePayload).to.equal(2);

    // expect connectio to be updated
    const connectionPayload = log.get('connection');
    expect(connectionPayload.personId).to.equal(2);
    expect(connectionPayload.type).to.equal(Connection.TYPE_IN_ROOM);

    // other people in room should know about new person
    const client1PeopleKeyed = client1Log.get('room_people_all_keyed');
    expect(client1PeopleKeyed.order.length).to.equal(2);
  })
})

describe("Client 2 can change their name", () => {
  it('should change names', () => {
    const client1Log = new Map();
    const client2Log = new Map();
    logEventListener(client1Log, client1, 'room_people_all_keyed');
    logEventListener(client2Log, client2, 'room_people_all_keyed');
  
    const newName = 'Bob';
    client2.emit('change_my_name', newName);
  
    console.log(client1Log);
    const myId = 2;
  
    const client1People = client1Log.get('room_people_all_keyed');
    expect(client1People).to.not.equal(undefined);
    const client1PersonMe = client1People.items[myId];
    expect(client1PersonMe.name).to.equal(newName);
  
    const client2People = client2Log.get('room_people_all_keyed');
    expect(client2People).to.not.equal(undefined);
    const client2PersonMe = client2People.items[myId];
    expect(client2PersonMe.name).to.equal(newName);
  })
})

describe("Leaving room and reassigning host", () => {
  it('when leaving room, next person should become host', () => {
    
  })
})