require('dotenv').config();

const App = require('./src/App');
const MasterProvider = require('./src/providers/MasterProvider');
const SocketIoServiceProvider = require('./src/providers/SocketIoProvider');
const MongoDbServiceProvider = require('./src/providers/MongoDbProvider');
const ExpressServiceProvider = require('./src/providers/ExpressProvider');

// App ===========================================
const app = new App();
// Add service providers required for app to run
app.addProvider(new ExpressServiceProvider());
app.addProvider(new MongoDbServiceProvider());
app.addProvider(new SocketIoServiceProvider());

app.addProvider(new MasterProvider());
app.start();
//________________________________________________
