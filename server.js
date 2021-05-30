require('dotenv').config();

const App = require('./src/App');
const SocketIoServiceProvider = require('./src/providers/SocketIoProvider');
const MongoDbServiceProvider = require('./src/providers/MongoDbProvider');
const ExpressServiceProvider = require('./src/providers/ExpressProvider');
const ConnectionManagerProvider = require('./src/providers/ConnectionManagerProvider');

const PersonManagerProvider = require('./src/providers/PersonManagerProvider');

// App ===========================================
const app = new App();
// Add service providers required for app to run
app.addProvider(new ExpressServiceProvider());
app.addProvider(new MongoDbServiceProvider());
app.addProvider(new SocketIoServiceProvider());
app.addProvider(new ConnectionManagerProvider());
app.addProvider(new PersonManagerProvider());

app.start();
//________________________________________________
