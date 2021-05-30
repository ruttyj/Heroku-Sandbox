require('dotenv').config();

const App = require('./src/App');
const SocketIoServiceProvider = require('./src/providers/SocketIoProvider');
const HandlerRegistryProvider = require('./src/providers/HandlerRegistryProvider');

const MongoDbServiceProvider = require('./src/providers/MongoDbProvider');
const ExpressServiceProvider = require('./src/providers/ExpressProvider');
const ConnectionManagerProvider = require('./src/providers/ConnectionManagerProvider');

const PersonManagerProvider = require('./src/providers/PersonManagerProvider');
const RoomManagerProvider = require('./src/providers/RoomManagerProvider');

// App ===========================================
const app = new App();
// Add service providers required for app to run
app.addProvider(new ExpressServiceProvider());
app.addProvider(new MongoDbServiceProvider());
app.addProvider(new SocketIoServiceProvider());
app.addProvider(new HandlerRegistryProvider());
app.addProvider(new ConnectionManagerProvider());
app.addProvider(new PersonManagerProvider());
app.addProvider(new RoomManagerProvider());

app.start();
//________________________________________________
