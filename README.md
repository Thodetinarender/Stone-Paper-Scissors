# Stone Paper Scissors Game

A full-stack web application for playing Stone Paper Scissors between two players over 6 rounds.

## Features

- **Stage 1**: 2-player game with 6 rounds, displaying scores and winner.
- **Stage 2**: Player naming, game data storage in MongoDB, and a history page to view all games.

## Tech Stack

- Frontend: React
- Backend: Node.js, Express
- Database: MongoDB

## Setup

1. Ensure MongoDB is installed and running on localhost:27017.

2. Clone or navigate to the project directory.

3. Install dependencies:
   - Root: `npm install`
   - Server: `cd server && npm install`
   - Client: `cd client && npm install`

4. Start the application:
   - `npm start` (runs both server and client concurrently)

5. Open http://localhost:3000 in your browser.

## Usage

- Enter player names and start the game.
- For each of 6 rounds, select choices and submit.
- View scores after each round.
- After 6 rounds, see the overall winner.
- Navigate to /history to view all past games.