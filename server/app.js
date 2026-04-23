const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// routes
const gameRoutes = require('./routes/games');
app.use('/api/games', gameRoutes);

// Serve React static files
app.use(express.static(path.join(__dirname, '../client/build')));

// Handle React routing - catch-all must be LAST
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(5000, () => console.log('Server running on port 5000'));