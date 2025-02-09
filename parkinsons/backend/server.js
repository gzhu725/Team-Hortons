const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRoutes = require('./user/userRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());  // Parse JSON requests
app.use(require('cors')());  // Enable CORS for cross-origin requests

// Routes
app.use('/api/users', userRoutes);  // Base route for user-related endpoints

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
        process.exit(1);  // Stop server on connection failure
    }
};



// Start server and connect to DB
connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

