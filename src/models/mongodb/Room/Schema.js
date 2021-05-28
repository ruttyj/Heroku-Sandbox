const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  title: String,
  joinable: Boolean,
  playerCount: Number,
  mode: String, // awaiting_players, in_setup, in_process, finished,
  state: String, // store additional data on this room
  cDate: { type: String, default: Date.now() }
})
