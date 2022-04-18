const express = require('express');
const songController = require('../controller/songController');

const route = express.Router();

route.get('/songs', songController.getAll);


module.exports = route;