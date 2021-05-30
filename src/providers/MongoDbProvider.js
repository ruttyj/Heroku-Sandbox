require('dotenv').config();
const BaseProvider = require('./BaseProvider');
const mongoose = require('mongoose');

// MongoDb IO Provider
module.exports = class MongoDbProvider extends BaseProvider {
  register(app)
  {
    // Mongo DB ======================================
    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    mongoose.connection.on('connected', () => {
      console.log("Mongoose is connected!");
    })
    
    app.addService('mongoose', mongoose);
  }
}