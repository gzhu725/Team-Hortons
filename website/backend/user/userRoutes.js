const express = require('express');
const router = express.Router();
const { createUser } = require('./userController');

// Create new user
router.post('/', createUser);

module.exports = router;
