const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const apiRoutes = require('./routes/api');
const { port, mongodbUri } = require('./config');

// Mongo DB ======================================
mongoose.connect(mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log("Mongoose is connected!");
})

/*
const newBlogPost = new BlogPost(data); // new instance of model

newBlogPost.save((error) => {
    if (error) {
        console.log('save failed');
    } else {
        console.log('save success');
    }
});
//*/

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

app.listen(port, console.log(`Server is Listening at ${port}`));
//________________________________________________
