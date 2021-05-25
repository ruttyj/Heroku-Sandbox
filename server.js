require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const apiRoutes = require('./routes/api');

const PORT = process.env.PORT || 8080;

// Mongo DB ======================================
console.log('path', process.env.MONGODB_URI);
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
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//app.use(cors()); // cross domain
app.use(morgan('tiny')); // http logging
app.use('/api', apiRoutes); 


// run built app on Heroku
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.listen(PORT, console.log(`Server is Listening at ${PORT}`));
//________________________________________________
