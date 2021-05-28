require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const http = require('http');
const BastProvider = require('./BaseProvider');
const apiRoutes = require('../routes/api');

module.exports = class ExpressProvider extends BastProvider {
  register(app)
  {
    // Express =======================================
    // HTTP request logger
    const PORT = process.env.PORT || 8080;
    const server = express();
    server.use(express.json());
    server.use(express.urlencoded({ extended: false }));
    server.use('/api', apiRoutes); 

    // run built app in production
    if (process.env.NODE_ENV === 'production') {
      server.use(express.static('client/build')); // build client
    } else {
      server.use(morgan('tiny')); // http logging
    }
    const httpServer = http.createServer(server);
    httpServer.listen(PORT, console.log(`Server is Listening at ${PORT}`));
    //________________________________________________
        
    app.addService('express', server);
    app.addService('http', httpServer);
  }
}
