const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// POST /api/games - create new game
router.post('/', async (req, res) => {
  const { player1, player2 } = req.body;
  const game = new Game({ player1, player2, rounds: [], winner: null });
  await game.save();
  res.json(game);
});

// GET /api/games - get all games
router.get('/', async (req, res) => {
  const games = await Game.find();
  res.json(games);
});

// PUT /api/games/:id - update game with round
router.put('/:id', async (req, res) => {
  const { round } = req.body;
  const game = await Game.findById(req.params.id);
  game.rounds.push(round);
  if (game.rounds.length === 6) {
    // calculate winner
    let p1Score = 0, p2Score = 0;
    game.rounds.forEach(r => {
      if (r.winner === 'player1') p1Score++;
      else if (r.winner === 'player2') p2Score++;
    });
    if (p1Score > p2Score) game.winner = game.player1;
    else if (p2Score > p1Score) game.winner = game.player2;
    else game.winner = 'tie';
  }
  await game.save();
  res.json(game);
});

module.exports = router;