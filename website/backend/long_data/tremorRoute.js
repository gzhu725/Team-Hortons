const express = require('express');
const router = express.Router();
const { getTremorData } = require('./tremorController');

// Define the GET route for tremor data
router.get('/', getTremorData);

module.exports = router;
