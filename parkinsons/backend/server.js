const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const detectPort = require('detect-port');
const userRoutes = require('./user/userRoutes');
const tremorRoutes = require('./long_data/tremorRoute');



// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(require('cors')());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tremor', tremorRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Parkinsons API is running...');
});

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

connectDB();

const DEFAULT_PORT = process.env.PORT || 5000;
detectPort.detectPort(DEFAULT_PORT)
  .then((availablePort) => {
    app.listen(availablePort, () => {
      console.log(`Server running on port ${availablePort}`);
    });
  })
  .catch((err) => {
    console.error('Error detecting available port:', err);
  });
