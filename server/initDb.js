const pool = require('./db');

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS games (
      id SERIAL PRIMARY KEY,
      player1 VARCHAR(100),
      player2 VARCHAR(100),
      winner VARCHAR(100)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS rounds (
      id SERIAL PRIMARY KEY,
      game_id INT REFERENCES games(id) ON DELETE CASCADE,
      player1_choice VARCHAR(20),
      player2_choice VARCHAR(20),
      winner VARCHAR(20)
    );
  `);

  console.log("Tables created");
  process.exit();
}

init();