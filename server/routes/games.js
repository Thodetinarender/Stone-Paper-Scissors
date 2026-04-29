const express = require('express');
const router = express.Router();
const pool = require('../db');


// CREATE GAME
router.post('/', async (req, res) => {
  try {
    const { player1, player2 } = req.body;

    const result = await pool.query(
      'INSERT INTO games (player1, player2, winner) VALUES ($1, $2, $3) RETURNING *',
      [player1, player2, null]
    );

    // return game with empty rounds array (important for frontend)
    const game = result.rows[0];
    game.rounds = [];

    res.json(game);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create game' });
  }
});


// GET ALL GAMES (with rounds)
router.get('/', async (req, res) => {
  try {
    const gamesResult = await pool.query('SELECT * FROM games ORDER BY id DESC');

    const games = [];

    for (let game of gamesResult.rows) {
      const roundsResult = await pool.query(
        'SELECT * FROM rounds WHERE game_id = $1',
        [game.id]
      );

      // map DB fields → frontend format
      game.rounds = roundsResult.rows.map(r => ({
        player1Choice: r.player1_choice,
        player2Choice: r.player2_choice,
        winner: r.winner
      }));

      games.push(game);
    }

    res.json(games);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});


// ADD ROUND
router.put('/:id', async (req, res) => {
  try {
    const gameId = req.params.id;
    const { round } = req.body;

    // insert round
    await pool.query(
      `INSERT INTO rounds (game_id, player1_choice, player2_choice, winner)
       VALUES ($1, $2, $3, $4)`,
      [gameId, round.player1Choice, round.player2Choice, round.winner]
    );

    // get all rounds
    const roundsResult = await pool.query(
      'SELECT * FROM rounds WHERE game_id = $1',
      [gameId]
    );

    const rounds = roundsResult.rows;

    let gameWinner = null;

    // calculate winner after 6 rounds
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

    // 🔥 RETURN FULL UPDATED GAME WITH ROUNDS (IMPORTANT)
    const gameResult = await pool.query(
      'SELECT * FROM games WHERE id = $1',
      [gameId]
    );

    const roundsUpdated = await pool.query(
      'SELECT * FROM rounds WHERE game_id = $1',
      [gameId]
    );

    const game = gameResult.rows[0];

    game.rounds = roundsUpdated.rows.map(r => ({
      player1Choice: r.player1_choice,
      player2Choice: r.player2_choice,
      winner: r.winner
    }));

    res.json(game);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update game' });
  }
});

module.exports = router;