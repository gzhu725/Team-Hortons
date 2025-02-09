const express = require('express');
const router = express.Router();
const { getUsers } = require('./userController');

// GET request to fetch all users
router.get('/', getUsers);

module.exports = router;
