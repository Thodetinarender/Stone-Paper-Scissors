import React, { useReducer } from 'react';
import { Link } from 'react-router-dom';
import './Game.css';

const API_URL = 'http://35.154.30.113:5000'; // process.env.REACT_APP_API_URL || 'http://localhost:5000';

const initialState = {
  playerName: '',
  gameId: null,
  currentRound: 1,
  rounds: [],
  computerChoice: 'STONE',
  playerChoice: 'STONE',
  computerPoints: 0,
  playerPoints: 0,
  shakeComputer: false,
  shakePlayer: false,
  gameStarted: false,
  winner: null,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, playerName: action.payload };

    case 'START_GAME':
      return { ...state, gameId: action.payload, gameStarted: true };

    case 'SHAKE':
      return {
        ...state,
        playerChoice: action.payload,
        shakeComputer: true,
        shakePlayer: true,
      };

    case 'STOP_SHAKE':
      return { ...state, shakeComputer: false, shakePlayer: false };

    case 'RESOLVE_ROUND':
      return {
        ...state,
        computerChoice: action.payload.compChoice,
        computerPoints: action.payload.cPoints,
        playerPoints: action.payload.pPoints,
        currentRound:
          state.currentRound < 6 ? state.currentRound + 1 : state.currentRound,
        winner: action.payload.winner,
      };

    case 'UPDATE_ROUNDS':
      return { ...state, rounds: action.payload };

    default:
      return state;
  }
}

const CHOICES = ['STONE', 'PAPER', 'SCISSORS'];

function getWinner(pChoice, cChoice) {
  if (pChoice === cChoice) return 'tie';
  if (
    (pChoice === 'STONE' && cChoice === 'SCISSORS') ||
    (pChoice === 'SCISSORS' && cChoice === 'PAPER') ||
    (pChoice === 'PAPER' && cChoice === 'STONE')
  ) return 'player1';
  return 'player2';
}

function computePoints(choice, compChoice, cPoints, pPoints) {
  if (choice === 'STONE') {
    if (compChoice === 'PAPER') return { cPoints: cPoints + 1, pPoints };
    if (compChoice === 'SCISSORS') return { cPoints, pPoints: pPoints + 1 };
  } else if (choice === 'PAPER') {
    if (compChoice === 'SCISSORS') return { cPoints: cPoints + 1, pPoints };
    if (compChoice === 'STONE') return { cPoints, pPoints: pPoints + 1 };
  } else {
    if (compChoice === 'STONE') return { cPoints: cPoints + 1, pPoints };
    if (compChoice === 'PAPER') return { cPoints, pPoints: pPoints + 1 };
  }
  return { cPoints, pPoints };
}

function Game() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const {
    playerName, gameId, currentRound, computerChoice, playerChoice,
    computerPoints, playerPoints, shakeComputer, shakePlayer,
    gameStarted, winner,
  } = state;

  const startGame = async () => {
    const res = await fetch(`${API_URL}/api/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player1: playerName, player2: 'Computer' }),
    });
    const game = await res.json();
    dispatch({ type: 'START_GAME', payload: game.id });
  };

  const submitRound = async (round) => {
    const res = await fetch(`${API_URL}/api/games/${gameId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ round }),
    });
    const updatedGame = await res.json();
    dispatch({ type: 'UPDATE_ROUNDS', payload: updatedGame.rounds });
  };

  const playRound = (choice) => {
    dispatch({ type: 'SHAKE', payload: choice });

    setTimeout(() => {
      dispatch({ type: 'STOP_SHAKE' });

      const compChoice = CHOICES[Math.floor(Math.random() * 3)];
      const { cPoints, pPoints } = computePoints(
        choice, compChoice, computerPoints, playerPoints
      );

      const isLastRound = currentRound >= 6;
      const overallWinner = isLastRound
        ? cPoints > pPoints ? 'Computer'
          : pPoints > cPoints ? playerName
            : 'tie'
        : null;

      dispatch({
        type: 'RESOLVE_ROUND',
        payload: { compChoice, cPoints, pPoints, winner: overallWinner },
      });

      const roundWinner = getWinner(choice, compChoice);
      submitRound({ player1Choice: choice, player2Choice: compChoice, winner: roundWinner });
    }, 900);
  };

  if (!gameStarted) {
    return (
      <div className="container">
        <div className="message">🎮 Stone Paper Scissors</div>
        <div className="welcome-section">
          <h2>Welcome to the Game!</h2>
          <p>Enter your name and play against the computer in 6 exciting rounds!</p>
          <div className="choice-preview">
            <span>🪨 Stone</span>
            <span>📄 Paper</span>
            <span>✂️ Scissors</span>
          </div>
        </div>
        <input
          type="text"
          placeholder="Enter Your Name"
          value={playerName}
          onChange={(e) => dispatch({ type: 'SET_NAME', payload: e.target.value })}
        />
        <button onClick={startGame} disabled={!playerName.trim()}>
          Start Game 🚀
        </button>
        <br />
        <Link to="/history" className="history-link">View Game History 📊</Link>
      </div>
    );
  }

  if (winner) {
    return (
      <div className="container">
        <div className="message">GAME OVER</div>
        <div className="winner">Winner: {winner}</div>
        <div className="points">
          COMPUTER <span className="computerPoints">{computerPoints}</span> /
          <span className="playerPoints">{playerPoints}</span> {playerName.toUpperCase()}
        </div>
        <Link to="/history">View Game History</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="message">CHOOSE AN OPTION - ROUND {currentRound}</div>
      <div className="images">
        <div className="computer">
          <div className={`choice-display ${shakeComputer ? 'shakeComputer' : ''}`}>
            {computerChoice === 'STONE' && '🪨'}
            {computerChoice === 'PAPER' && '📄'}
            {computerChoice === 'SCISSORS' && '✂️'}
          </div>
          <p>Computer</p>
        </div>
        <div className="player">
          <div className={`choice-display ${shakePlayer ? 'shakePlayer' : ''}`}>
            {playerChoice === 'STONE' && '🪨'}
            {playerChoice === 'PAPER' && '📄'}
            {playerChoice === 'SCISSORS' && '✂️'}
          </div>
          <p>{playerName}</p>
        </div>
      </div>
      <div className="points">
        COMPUTER <span className="computerPoints">{computerPoints}</span> /
        <span className="playerPoints">{playerPoints}</span> {playerName.toUpperCase()}
      </div>
      <div className="options">
        <button type="button" onClick={() => playRound('STONE')}>STONE</button>
        <button type="button" onClick={() => playRound('PAPER')}>PAPER</button>
        <button type="button" onClick={() => playRound('SCISSORS')}>SCISSORS</button>
      </div>
    </div>
  );
}

export default Game;