const express = require('express');
const userController = require('../controller/userController');

const route = express.Router();

route.post('/users/login', userController.login);



module.exports = route;