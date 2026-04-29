import React, { useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './History.css';

const API_URL = 'http://35.154.30.113:5000'; // process.env.REACT_APP_API_URL || 'http://localhost:5000';

function historyReducer(state, action) {
  switch (action.type) {
    case 'SET_GAMES':
      return { ...state, games: action.payload };
    case 'OPEN_MODAL':
      return { ...state, selectedGame: action.payload };
    case 'CLOSE_MODAL':
      return { ...state, selectedGame: null };
    default:
      return state;
  }
}

const initialState = { games: [], selectedGame: null };

function History() {
  const [state, dispatch] = useReducer(historyReducer, initialState);
  const { games, selectedGame } = state;

  useEffect(() => {
    fetch(`${API_URL}/api/games`)
      .then((res) => res.json())
      .then((data) => dispatch({ type: 'SET_GAMES', payload: data }));
  }, []);

  const getChoiceEmoji = (choice) => {
    switch (choice) {
      case 'STONE':    return '🪨';
      case 'PAPER':    return '📄';
      case 'SCISSORS': return '✂️';
      default:         return choice;
    }
  };

  const getWinnerLabel = (round, game) => {
    if (round.winner === 'player1') return game.player1;
    if (round.winner === 'player2') return game.player2;
    return 'Tie';
  };

  return (
    <div className="history-container">
      <div className="history-header">
        <h1>🏆 Game History</h1>
        <Link to="/" className="back-button">&#8592; Play Again</Link>
      </div>

      {games.length === 0 ? (
        <p className="no-games">No games played yet. Go play one! 🎮</p>
      ) : (
        <div className="games-grid">
          {games.map((game) => (
            <div key={game.id} className="game-card">

              {/* Card Header */}
              <div className="card-header">
                <div className="players">
                  <span className="player-tag">{game.player1}</span>
                  <span className="vs">vs</span>
                  <span className="player-tag computer">{game.player2}</span>
                </div>
                <div className="rounds-count">{game.rounds?.length || 0} rounds</div>
              </div>

              {/* Winner Banner */}
              <div className="winner-banner">
                <span className="trophy">🏆</span>
                <span className="winner-label">
                  {game.winner === 'tie' ? "It's a Tie!" : `${game.winner} wins!`}
                </span>
              </div>

              {/* Show Rounds Button */}
              <button
                className="toggle-btn"
                onClick={() => dispatch({ type: 'OPEN_MODAL', payload: game })}
              >
                ▼ Show Rounds
              </button>

            </div>
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      {selectedGame && (
        <div className="modal-overlay" onClick={() => dispatch({ type: 'CLOSE_MODAL' })}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>

            <div className="modal-header">
              <div className="players">
                <span className="player-tag">{selectedGame.player1}</span>
                <span className="vs">vs</span>
                <span className="player-tag computer">{selectedGame.player2}</span>
              </div>
              <button
                className="modal-close"
                onClick={() => dispatch({ type: 'CLOSE_MODAL' })}
              >
                ✕
              </button>
            </div>

            <div className="modal-winner">
              🏆 {selectedGame.winner === 'tie' ? "It's a Tie!" : `${selectedGame.winner} wins!`}
            </div>

            <div className="rounds-list">
              {selectedGame.rounds.map((round, i) => (
                <div key={i} className="round-row">
                  <span className="round-num">R{i + 1}</span>
                  <span className="round-choice">{getChoiceEmoji(round.player1Choice)}</span>
                  <span className="round-sep">—</span>
                  <span className="round-choice">{getChoiceEmoji(round.player2Choice)}</span>
                  <span className={`round-result ${round.winner === 'tie' ? 'tie' : ''}`}>
                    {getWinnerLabel(round, selectedGame)}
                  </span>
                </div>
              ))}
            </div>

            <button
              className="modal-hide-btn"
              onClick={() => dispatch({ type: 'CLOSE_MODAL' })}
            >
              ✕ Hide Rounds
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

export default History;