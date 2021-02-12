const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user.controller');

const jsonParser = express.json();

router.post('/signup', jsonParser, UserController.signUp);

module.exports = router;
