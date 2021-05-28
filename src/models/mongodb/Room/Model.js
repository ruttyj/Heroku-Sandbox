const mongoose = require('mongoose');
const Schema = require('./Schema');

const MODEL_NAME = 'Room'

module.exports = mongoose.model(MODEL_NAME, Schema);
