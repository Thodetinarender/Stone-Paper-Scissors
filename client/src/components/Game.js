import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Game.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Game() {
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [rounds, setRounds] = useState([]);
  const [computerChoice, setComputerChoice] = useState('STONE');
  const [playerChoice, setPlayerChoice] = useState('STONE');
  const [computerPoints, setComputerPoints] = useState(0);
  const [playerPoints, setPlayerPoints] = useState(0);
  const [shakeComputer, setShakeComputer] = useState(false);
  const [shakePlayer, setShakePlayer] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState(null);

  const startGame = async () => {
    const res = await fetch(`${API_URL}/api/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player1: playerName, player2: 'Computer' })
    });
    const game = await res.json();
    setGameId(game._id);
    setGameStarted(true);
  };

  const playRound = (choice) => {
    setPlayerChoice(choice);
    setShakeComputer(true);
    setShakePlayer(true);

    setTimeout(() => {
      setShakeComputer(false);
      setShakePlayer(false);

      const choices = ['STONE', 'PAPER', 'SCISSORS'];
      const compChoice = choices[Math.floor(Math.random() * 3)];
      setComputerChoice(compChoice);

      let cPoints = computerPoints;
      let pPoints = playerPoints;

      if (choice === 'STONE') {
        if (compChoice === 'PAPER') cPoints += 1;
        else if (compChoice === 'SCISSORS') pPoints += 1;
      } else if (choice === 'PAPER') {
        if (compChoice === 'SCISSORS') cPoints += 1;
        else if (compChoice === 'STONE') pPoints += 1;
      } else {
        if (compChoice === 'STONE') cPoints += 1;
        else if (compChoice === 'PAPER') pPoints += 1;
      }

      setComputerPoints(cPoints);
      setPlayerPoints(pPoints);

      const roundWinner = getWinner(choice, compChoice);
      const round = { player1Choice: choice, player2Choice: compChoice, winner: roundWinner };
      submitRound(round);

      if (currentRound < 6) {
        setCurrentRound(currentRound + 1);
      } else {
        const overallWinner = cPoints > pPoints ? 'Computer' : pPoints > cPoints ? playerName : 'tie';
        setWinner(overallWinner);
      }
    }, 900);
  };

  const submitRound = async (round) => {
    const res = await fetch(`${API_URL}/api/games/${gameId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ round })
    });
    const updatedGame = await res.json();
    setRounds(updatedGame.rounds);
  };

  const getWinner = (pChoice, cChoice) => {
    if (pChoice === cChoice) return 'tie';
    if ((pChoice === 'STONE' && cChoice === 'SCISSORS') ||
        (pChoice === 'SCISSORS' && cChoice === 'PAPER') ||
        (pChoice === 'PAPER' && cChoice === 'STONE')) return 'player1';
    return 'player2';
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
          onChange={(e) => setPlayerName(e.target.value)}
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