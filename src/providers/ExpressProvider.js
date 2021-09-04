require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser')
const morgan = require('morgan');
const http = require('http');
const BaseProvider = require('./BaseProvider');
const apiRoutes = require('../routes/api');
module.exports = class ExpressProvider extends BaseProvider {
  register(app)
  {
    // Express =======================================
    // HTTP request logger
    const PORT = process.env.PORT || 8080;
    const server = express();
    server.use(express.json());
    server.use(express.urlencoded({ extended: false }));

    server.use(cookieParser());
    server.use((req, res, next) => {
      console.log('Cookies: ', req.cookies);
      next();
    });

    server.get('/cookie', (req, res, next) => {
      res.cookie('cookie' , 'cookie_value').send('Cookie is set');
      console.log('Cookies: ', req.cookies);
      next();
    });
    
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

  boot(app)
  {

  }
}
