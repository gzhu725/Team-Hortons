const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const userRoutes = require('./user/userRoutes'); // Correct user routes
const tremorRoutes = require('./long_data/tremorRoute'); // Correct tremor routes

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for frontend requests

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}) 
  .then(() => console.log('MongoDB connected to ', process.env.MONGO_URI))
  .catch(err => console.error('MongoDB connection error:', err));

// API routes for users and tremor data
// app.use('/api/users', userRoutes);
app.use('/api/tremor', tremorRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
