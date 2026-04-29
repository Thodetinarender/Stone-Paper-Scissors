const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// routes
const gameRoutes = require('./routes/games');
app.use('/api/games', gameRoutes);

// Serve React
app.use(express.static(path.join(__dirname, '../client/build')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));