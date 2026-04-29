const express = require('express');
const router = express.Router();
const pool = require('../db');


// CREATE GAME
router.post('/', async (req, res) => {
  const { player1, player2 } = req.body;

  const result = await pool.query(
    'INSERT INTO games (player1, player2, winner) VALUES ($1, $2, $3) RETURNING *',
    [player1, player2, null]
  );

  res.json(result.rows[0]);
});


// GET ALL GAMES
router.get('/', async (req, res) => {
  const gamesResult = await pool.query('SELECT * FROM games');

  const games = [];

  for (let game of gamesResult.rows) {
    const roundsResult = await pool.query(
      'SELECT * FROM rounds WHERE game_id = $1',
      [game.id]
    );

    game.rounds = roundsResult.rows;
    games.push(game);
  }

  res.json(games);
});


// ADD ROUND
router.put('/:id', async (req, res) => {
  const gameId = req.params.id;
  const { round } = req.body;

  await pool.query(
    `INSERT INTO rounds (game_id, player1_choice, player2_choice, winner)
     VALUES ($1, $2, $3, $4)`,
    [gameId, round.player1Choice, round.player2Choice, round.winner]
  );

  const roundsResult = await pool.query(
    'SELECT * FROM rounds WHERE game_id = $1',
    [gameId]
  );

  const rounds = roundsResult.rows;

  let gameWinner = null;

  if (rounds.length === 6) {
    let p1Score = 0, p2Score = 0;

    rounds.forEach(r => {
      if (r.winner === 'player1') p1Score++;
      else if (r.winner === 'player2') p2Score++;
    });

    const gameResult = await pool.query(
      'SELECT * FROM games WHERE id = $1',
      [gameId]
    );

    const game = gameResult.rows[0];

    if (p1Score > p2Score) gameWinner = game.player1;
    else if (p2Score > p1Score) gameWinner = game.player2;
    else gameWinner = 'tie';

    await pool.query(
      'UPDATE games SET winner = $1 WHERE id = $2',
      [gameWinner, gameId]
    );
  }

  const updatedGame = await pool.query(
    'SELECT * FROM games WHERE id = $1',
    [gameId]
  );

  res.json(updatedGame.rows[0]);
});

module.exports = router;