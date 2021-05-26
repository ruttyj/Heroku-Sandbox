require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const socketIO = require('socket.io');
const http = require('http');

const App = require('./src/App');
const apiRoutes = require('./src/routes/api');
const MasterProvider = require('./src/providers/MasterProvider');

const PORT = process.env.PORT || 8080;

// Mongo DB ======================================
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log("Mongoose is connected!");
})
//________________________________________________


// Express =======================================
// HTTP request logger
const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use('/api', apiRoutes); 

// run built app on Heroku
if (process.env.NODE_ENV === 'production') {
  server.use(express.static('client/build'));
} else {
  server.use(morgan('tiny')); // http logging
}
const httpServer = http.createServer(server);
httpServer.listen(PORT, console.log(`Server is Listening at ${PORT}`));
//________________________________________________


// SocketIO ======================================
const io = socketIO(httpServer);
io.on('connection', (socket) => {
  console.log('Socket connected!');
  socket.on('disconnect', () => console.log('Socket disconnected'));
});
setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
//________________________________________________


// App ===========================================
const app = new App();
app.addService('SOCKET_IO', io);
app.addService('EXPRESS', server);
app.addService('HTTP', httpServer);
app.addProvider(new MasterProvider());
app.start();
//________________________________________________
