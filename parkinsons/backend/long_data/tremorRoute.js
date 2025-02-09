const express = require('express');
const router = express.Router();
const { getAllEntries } = require('./tremorController');

// Get all entries
router.get('/', getAllEntries);

module.exports = router;




