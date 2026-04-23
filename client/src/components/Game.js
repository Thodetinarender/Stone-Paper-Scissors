// Importing necessary libraries

import React from 'react';

const Game = () => {
    // Using dynamic API URL from environment variable
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    // Rest of your Game component code...

    return (
        <div>
            <h1>Stone Paper Scissors</h1>
            {/* Game UI goes here */}
        </div>
    );
};

export default Game;
