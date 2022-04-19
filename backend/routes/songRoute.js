const express = require('express');
const songController = require('../controller/songController');
const currentUser = require('../middleware/current-user');

const route = express.Router();

route.get('/songs',currentUser, songController.getAll);
route.get('/songs/search',currentUser, songController.search);
route.get('/songs/mp3',songController.getMp3);

module.exports = route;