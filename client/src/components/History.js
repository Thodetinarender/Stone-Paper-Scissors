import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './History.css';

function History() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/games')
      .then(res => res.json())
      .then(data => setGames(data));
  }, []);

  const getChoiceEmoji = (choice) => {
    switch(choice) {
      case 'STONE': return '🪨';
      case 'PAPER': return '📄';
      case 'SCISSORS': return '✂️';
      default: return choice;
    }
  };

  return (
    <div className="history-container">
      <h1>Game History</h1>
      <Link to="/" className="back-button">Play New Game</Link>
      <div className="games-list">
        {games.length === 0 ? (
          <p className="no-games">No games played yet!</p>
        ) : (
          games.map(game => (
            <div key={game._id} className="game-card">
              <h3>{game.player1} vs {game.player2}</h3>
              <p className="winner">Winner: <span className="winner-name">{game.winner}</span></p>
              <div className="rounds">
                {game.rounds.map((round, i) => (
                  <div key={i} className="round">
                    <span className="round-number">Round {i+1}:</span>
                    <span className="choices">
                      {game.player1} {getChoiceEmoji(round.player1Choice)} vs {game.player2} {getChoiceEmoji(round.player2Choice)}
                    </span>
                    <span className="round-winner">
                      Winner: {round.winner === 'player1' ? game.player1 : round.winner === 'player2' ? game.player2 : 'Tie'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default History;