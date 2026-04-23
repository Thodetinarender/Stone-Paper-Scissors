const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
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

app.listen(5000, () => console.log('Server running on port 5000'));