const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
  player1Choice: String,
  player2Choice: String,
  winner: String // 'player1', 'player2', 'tie'
});

const gameSchema = new mongoose.Schema({
  player1: String,
  player2: String,
  rounds: [roundSchema],
  winner: String
});

module.exports = mongoose.model('Game', gameSchema);